import { describe, expect, it } from "vitest";
import type { AlgorithmDescriptor, ImageAsset } from "@/types/api";
import { editorReducer, initialEditorState } from "./editor-state";

const catalog: AlgorithmDescriptor[] = [
  {
    id: "adjust_gamma",
    tool_id: "brightness",
    name: "Điều chỉnh gamma",
    description: "",
    implementation_status: "not_implemented",
    params: [
      {
        key: "gamma",
        label: "Gamma",
        description: "",
        kind: "number",
        default: 1,
        integer: false,
        min: 0.1,
        max: 3,
        step: 0.05,
        options: [],
      },
    ],
  },
];

const asset: ImageAsset = {
  image_id: "image-one",
  filename: "photo.jpg",
  content_type: "image/jpeg",
  size_bytes: 100,
  width: 80,
  height: 60,
  url: "/api/images/image-one",
};

describe("editorReducer", () => {
  it("records config changes, undoes them, and resets to catalog defaults", () => {
    let state = editorReducer(initialEditorState, { type: "API_READY", catalog });
    state = editorReducer(state, {
      type: "SET_PARAM",
      algorithmId: "adjust_gamma",
      key: "gamma",
      value: 1.5,
    });
    expect(state.config.params.adjust_gamma.gamma).toBe(1.5);
    expect(state.history).toHaveLength(2);

    state = editorReducer(state, { type: "UNDO_CONFIG" });
    expect(state.config.params.adjust_gamma.gamma).toBe(1);

    state = editorReducer(state, {
      type: "SET_ENABLED",
      toolId: "brightness",
      enabled: true,
    });
    state = editorReducer(state, { type: "RESET_CONFIG" });
    expect(state.config.enabled.brightness).toBe(false);
    expect(state.config.params.adjust_gamma.gamma).toBe(1);
    expect(state.historyIndex).toBe(2);
  });

  it("clears image-owned state on replacement and ignores late responses from an old generation", () => {
    let state = editorReducer(initialEditorState, { type: "API_READY", catalog });
    const oldFile = new File(["old"], "old.jpg", { type: "image/jpeg" });
    const newFile = new File(["new"], "new.png", { type: "image/png" });
    state = editorReducer(state, {
      type: "FILE_SELECTED",
      file: oldFile,
      previewUrl: "blob:old",
      width: 30,
      height: 20,
      generation: 1,
    });
    state = editorReducer(state, { type: "UPLOAD_SUCCEEDED", generation: 1, asset });
    state = editorReducer(state, {
      type: "SET_ENABLED",
      toolId: "brightness",
      enabled: true,
    });

    state = editorReducer(state, {
      type: "FILE_SELECTED",
      file: newFile,
      previewUrl: "blob:new",
      width: 50,
      height: 40,
      generation: 2,
    });
    state = editorReducer(state, { type: "UPLOAD_SUCCEEDED", generation: 1, asset });

    expect(state.file).toBe(newFile);
    expect(state.previewUrl).toBe("blob:new");
    expect(state.uploaded).toBeNull();
    expect(state.uploadStatus).toBe("uploading");
    expect(state.config.enabled.brightness).toBe(false);
    expect(state.result).toBeNull();
    expect(state.proposal).toBeNull();
  });

  it("caps undo history at fifty snapshots", () => {
    let state = editorReducer(initialEditorState, { type: "API_READY", catalog });
    for (let index = 0; index < 60; index += 1) {
      state = editorReducer(state, {
        type: "SET_PARAM",
        algorithmId: "adjust_gamma",
        key: "gamma",
        value: 0.1 + (index % 29) * 0.1,
      });
    }
    expect(state.history.length).toBeLessThanOrEqual(50);
  });
});
