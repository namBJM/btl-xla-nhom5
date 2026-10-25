"use client";

import { Bot, Check, LoaderCircle, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import type { AdviceResponse } from "@/types/api";
import type { EditorState } from "@/features/editor/editor-state";

type AdvisorPanelProps = {
  state: EditorState;
  busy: boolean;
  onAdvise: (prompt: string) => void;
  onApplyProposal: (proposal: AdviceResponse) => string | null;
};

export function AdvisorPanel({ state, busy, onAdvise, onApplyProposal }: AdvisorPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [applyError, setApplyError] = useState<string | null>(null);
  const hasUpload = state.connectionStatus === "ready" && Boolean(state.catalog?.length && state.uploaded);
  const canSubmit = hasUpload && prompt.trim().length > 0 && !busy;

  function applyProposal() {
    if (!state.proposal) return;
    const error = onApplyProposal(state.proposal);
    setApplyError(error);
  }

  return (
    <div className="advisor-panel">
      <div className="sidebar-intro advisor-intro">
        <div className="sidebar-title-row">
          <span className="sidebar-heading-icon advisor-heading-icon"><Sparkles size={16} /></span>
          <div>
            <h2>AI tư vấn</h2>
            <p>Nhận xét ảnh và gợi ý cấu hình</p>
          </div>
        </div>
        <span className="small-status-label">CHƯA TRIỂN KHAI</span>
      </div>

      <div className="advisor-scroll-area">
        <div className="advisor-explainer">
          <div className="advisor-explainer-icon"><Bot size={18} /></div>
          <div>
            <strong>Gợi ý theo mục tiêu của bạn</strong>
            <p>AI sẽ nhận xét ảnh đã tải lên và đề xuất các thông số phù hợp. Chưa có phân tích nào được tạo.</p>
          </div>
        </div>

        <label className="advisor-prompt-label" htmlFor="advisor-prompt">Bạn muốn cải thiện điều gì?</label>
        <textarea
          id="advisor-prompt"
          className="advisor-prompt"
          maxLength={2000}
          rows={5}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ví dụ: Ảnh hơi tối, tôi muốn giữ vẻ tự nhiên…"
          disabled={busy && state.adviseStatus === "loading"}
        />
        <div className="prompt-footline">
          <span>Không nhập thông tin nhạy cảm</span>
          <span>{prompt.length.toLocaleString("vi-VN")} / 2.000</span>
        </div>

        {!hasUpload && (
          <div className="advisor-requirement" role="note">
            Tải ảnh lên backend trước khi yêu cầu tư vấn.
          </div>
        )}

        {state.adviseStatus === "loading" && (
          <div className="advisor-request-message" role="status" aria-live="polite">
            <LoaderCircle className="spin" size={15} /> Đang gửi ảnh và yêu cầu…
          </div>
        )}
        {(state.adviseStatus === "error" || state.adviseStatus === "not_implemented") && state.adviseError && (
          <div className="advisor-request-message advisor-error" role="alert">
            {state.adviseError.message}
          </div>
        )}
        {applyError && <div className="advisor-request-message advisor-error" role="alert">{applyError}</div>}

        {state.proposal ? (
          <div className="proposal-card">
            <div className="proposal-title"><Sparkles size={15} /><h3>Phân tích và đề xuất</h3></div>
            <p className="proposal-analysis">{state.proposal.analysis}</p>
            {state.proposal.steps.length > 0 ? (
              <ol className="proposal-steps">
                {state.proposal.steps.map((step, index) => {
                  const algorithm = state.catalog?.find((item) => item.id === step.algorithm);
                  return (
                    <li key={`${step.algorithm}-${index}`}>
                      <div className="proposal-step-heading">
                        <span className="proposal-step-number">{index + 1}</span>
                        <strong>{algorithm?.name ?? step.algorithm}</strong>
                      </div>
                      <p>{step.reason}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="proposal-no-steps">Chưa có bước điều chỉnh nào được đề xuất.</p>
            )}
            <button type="button" className="secondary-button apply-proposal" onClick={applyProposal}>
              <Check size={14} /> Áp dụng cấu hình
            </button>
          </div>
        ) : (
          <div className="advisor-empty-response">
            <span className="advisor-empty-icon"><Sparkles size={17} /></span>
            <strong>Chưa có nhận xét</strong>
            <span>Kết quả tư vấn thật sẽ xuất hiện tại đây.</span>
          </div>
        )}
      </div>

      <div className="sidebar-actions advisor-actions">
        <p className="no-preview-note">Yêu cầu sẽ gửi cấu hình hiện tại cùng ảnh đã tải lên.</p>
        <button
          type="button"
          className="primary-button advisor-submit"
          disabled={!canSubmit}
          onClick={() => onAdvise(prompt.trim())}
        >
          {state.adviseStatus === "loading" ? <LoaderCircle className="spin" size={15} /> : <Send size={14} />}
          {state.adviseStatus === "loading" ? "Đang phân tích…" : "Phân tích ảnh"}
        </button>
      </div>
    </div>
  );
}
