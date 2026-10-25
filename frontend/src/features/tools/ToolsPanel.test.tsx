// @vitest-environment jsdom

import { useReducer } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { editorReducer, initialEditorState } from "@/features/editor/editor-state";
import { serializeSteps } from "@/features/editor/serialization";
import type { AlgorithmDescriptor, ImageAsset } from "@/types/api";
import { ToolsPanel } from "./ToolsPanel";

const catalog: AlgorithmDescriptor[] = [
  {
    id: "denoise_median",
    tool_id: "denoise",
    name: "Median",
    description: "Lọc nhiễu median.",
    implementation_status: "not_implemented",
    params: [
      {
        key: "kernel_size",
        label: "Kích thước kernel",
        description: "",
        kind: "select",
        default: 3,
        integer: true,
        min: null,
        max: null,
        step: null,
        options: [
          { value: 3, label: "3" },
          { value: 5, label: "5" },
          { value: 7, label: "7" },
        ],
      },
    ],
  },
  {
    id: "denoise_bilateral",
    tool_id: "denoise",
    name: "Bilateral",
    description: "Lọc nhiễu bilateral.",
    implementation_status: "not_implemented",
    params: [
      {
        key: "diameter",
        label: "Đường kính",
        description: "",
        kind: "select",
        default: 5,
        integer: true,
        min: null,
        max: null,
        step: null,
        options: [
          { value: 5, label: "5" },
          { value: 7, label: "7" },
          { value: 9, label: "9" },
        ],
      },
      numberParam("sigma_color", "Sigma màu", 50, 1, 150, 1, true),
      numberParam("sigma_space", "Sigma không gian", 50, 1, 150, 1, true),
    ],
  },
  {
    id: "adjust_gamma",
    tool_id: "brightness",
    name: "Điều chỉnh gamma",
    description: "",
    implementation_status: "not_implemented",
    params: [numberParam("gamma", "Gamma", 1, 0.1, 3, 0.05, false)],
  },
  {
    id: "enhance_clahe",
    tool_id: "contrast",
    name: "Tăng tương phản",
    description: "",
    implementation_status: "not_implemented",
    params: [],
  },
  {
    id: "upscale_image",
    tool_id: "upscale",
    name: "Nâng độ phân giải",
    description: "",
    implementation_status: "not_implemented",
    params: [
      {
        key: "scale",
        label: "Tỷ lệ phóng",
        description: "",
        kind: "select",
        default: 2,
        integer: true,
        min: null,
        max: null,
        step: null,
        options: [
          { value: 2, label: "2x" },
          { value: 4, label: "4x" },
        ],
      },
    ],
  },
];

const uploadedAsset: ImageAsset = {
  image_id: "image-id",
  filename: "photo.png",
  content_type: "image/png",
  size_bytes: 1024,
  width: 64,
  height: 48,
  url: "/api/images/image-id",
};

afterEach(() => cleanup());

describe("ToolsPanel parameter controls", () => {
  it("keeps range focus across keyboard commits and accepts successive arrow presses", async () => {
    const user = userEvent.setup();
    await openBrightness(user);
    const slider = screen.getByRole("slider", { name: "Gamma, thanh điều chỉnh" }) as HTMLInputElement;
    slider.focus();
    expect(document.activeElement).toBe(slider);

    pressArrowRight(slider, 1.05);
    expect((screen.getByRole("spinbutton", { name: "Gamma, giá trị số" }) as HTMLInputElement).value).toBe("1.05");
    expect(slider.value).toBe("1.05");
    expect(document.activeElement).toBe(slider);

    pressArrowRight(slider, 1.1);
    expect((screen.getByRole("spinbutton", { name: "Gamma, giá trị số" }) as HTMLInputElement).value).toBe("1.1");
    expect(slider.value).toBe("1.1");
    expect(document.activeElement).toBe(slider);
  });

  it("links the numeric display during a drag and commits one history entry, with undo/reset syncing drafts", async () => {
    const user = userEvent.setup();
    await openBrightness(user);

    const slider = screen.getByRole("slider", { name: "Gamma, thanh điều chỉnh" }) as HTMLInputElement;
    const numericInput = screen.getByRole("spinbutton", { name: "Gamma, giá trị số" }) as HTMLInputElement;
    expect(screen.getByTestId("history-index").textContent).toBe("0");

    fireEvent.change(slider, { target: { value: "1.05" } });
    fireEvent.change(slider, { target: { value: "1.15" } });
    expect(numericInput.value).toBe("1.15");
    expect(screen.getByTestId("history-index").textContent).toBe("0");

    fireEvent.pointerUp(slider);
    expect(screen.getByTestId("history-index").textContent).toBe("1");
    expect(numericInput.value).toBe("1.15");

    fireEvent.change(numericInput, { target: { value: "2.6" } });
    expect(numericInput.value).toBe("2.6");
    fireEvent.click(screen.getByRole("button", { name: "Reset config" }));
    expect(numericInput.value).toBe("1");
    expect(slider.value).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: "Undo config" }));
    expect(numericInput.value).toBe("1.15");
    expect(slider.value).toBe("1.15");
  });

  it("clears local drafts on undo/reset even when that parameter's committed value is unchanged", async () => {
    const user = userEvent.setup();
    await openBrightness(user);
    const numericInput = screen.getByRole("spinbutton", { name: "Gamma, giá trị số" }) as HTMLInputElement;

    fireEvent.change(numericInput, { target: { value: "2.6" } });
    fireEvent.click(screen.getByRole("switch", { name: "Bật Tăng tương phản" }));
    expect(numericInput.value).toBe("2.6");
    fireEvent.click(screen.getByRole("button", { name: "Undo config" }));
    expect(numericInput.value).toBe("1");

    fireEvent.change(numericInput, { target: { value: "2.4" } });
    fireEvent.click(screen.getByRole("switch", { name: "Bật Tăng tương phản" }));
    expect(numericInput.value).toBe("2.4");
    fireEvent.click(screen.getByRole("button", { name: "Reset config" }));
    expect(numericInput.value).toBe("1");
  });

  it("serializes select controls as numeric kernel_size, diameter, and scale values", async () => {
    const user = userEvent.setup();
    render(<ToolsPanelHarness />);

    await user.click(screen.getByRole("switch", { name: "Bật Khử nhiễu" }));
    await user.selectOptions(screen.getByLabelText("Kích thước kernel"), "5");
    let steps = readSerializedSteps();
    expect(steps[0].params.kernel_size).toBe(5);
    expect(typeof steps[0].params.kernel_size).toBe("number");

    await user.selectOptions(screen.getByLabelText("Phương pháp"), "denoise_bilateral");
    await user.selectOptions(screen.getByLabelText("Đường kính"), "9");
    steps = readSerializedSteps();
    expect(steps[0].params.diameter).toBe(9);
    expect(typeof steps[0].params.diameter).toBe("number");

    await user.click(screen.getByRole("switch", { name: "Bật Nâng độ phân giải" }));
    await user.click(screen.getByRole("button", { name: /Nâng độ phân giải/ }));
    await user.selectOptions(screen.getByLabelText("Tỷ lệ phóng"), "4");
    steps = readSerializedSteps();
    expect(steps.at(-1)?.params.scale).toBe(4);
    expect(typeof steps.at(-1)?.params.scale).toBe("number");
  });
});

function numberParam(
  key: string,
  label: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number,
  integer: boolean,
) {
  return {
    key,
    label,
    description: "",
    kind: "number" as const,
    default: defaultValue,
    integer,
    min,
    max,
    step,
    options: [],
  };
}

function createUploadedState() {
  let state = editorReducer(initialEditorState, { type: "API_READY", catalog });
  state = editorReducer(state, {
    type: "FILE_SELECTED",
    file: new File(["image"], "photo.png", { type: "image/png" }),
    previewUrl: "blob:photo",
    width: 64,
    height: 48,
    generation: 1,
  });
  return editorReducer(state, { type: "UPLOAD_SUCCEEDED", generation: 1, asset: uploadedAsset });
}

function ToolsPanelHarness() {
  const [state, dispatch] = useReducer(editorReducer, createUploadedState());
  const steps = state.catalog ? serializeSteps(state.config, state.catalog) : [];

  return (
    <>
      <output data-testid="history-index">{state.historyIndex}</output>
      <button type="button" onClick={() => dispatch({ type: "RESET_CONFIG" })}>Reset config</button>
      <button type="button" onClick={() => dispatch({ type: "UNDO_CONFIG" })}>Undo config</button>
      <output data-testid="serialized-steps">{JSON.stringify(steps)}</output>
      <ToolsPanel state={state} dispatch={dispatch} busy={false} onProcess={() => undefined} />
    </>
  );
}

async function openBrightness(user: ReturnType<typeof userEvent.setup>) {
  render(<ToolsPanelHarness />);
  await user.click(screen.getByRole("button", { name: /Điều chỉnh độ sáng/ }));
}

function readSerializedSteps(): Array<{ algorithm: string; params: Record<string, number> }> {
  return JSON.parse(screen.getByTestId("serialized-steps").textContent ?? "[]") as Array<{
    algorithm: string;
    params: Record<string, number>;
  }>;
}

function pressArrowRight(slider: HTMLInputElement, nextValue: number) {
  fireEvent.keyDown(slider, { key: "ArrowRight", code: "ArrowRight" });
  // jsdom does not implement the browser's native range-input arrow default action.
  fireEvent.change(slider, { target: { value: String(nextValue) } });
  fireEvent.keyUp(slider, { key: "ArrowRight", code: "ArrowRight" });
}
