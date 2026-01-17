import { useState, forwardRef, useEffect, useRef, useImperativeHandle, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import { IoEyeOutline, IoCreateOutline, IoCodeSlashOutline } from "react-icons/io5";

interface MarkdownEditorProps {
    label?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    name?: string;
    minRows?: number;
    className?: string;
    disabled?: boolean;
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
    (
        {
            label,
            required = false,
            error,
            helperText,
            placeholder = "Write your content here... Supports **bold**, *italic*, `code`, lists, and more!",
            value = "",
            onChange,
            onBlur,
            name,
            minRows = 5,
            className = "",
            disabled = false,
        },
        ref
    ) => {
        const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
        const [content, setContent] = useState(value);
        const internalRef = useRef<HTMLTextAreaElement>(null);

        // Forward ref properly
        useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

        useEffect(() => {
            setContent(value);
        }, [value]);

        const adjustHeight = (resetHeight = true) => {
            const textarea = internalRef.current;
            if (textarea) {
                // Determine if we need to reset height to auto
                if (resetHeight) {
                    textarea.style.height = 'auto';
                }

                // Get computed styles for accurate calculation
                const computedStyle = getComputedStyle(textarea);
                const lineHeight = parseInt(computedStyle.lineHeight) || 24;
                const paddingTop = parseInt(computedStyle.paddingTop) || 12;
                const paddingBottom = parseInt(computedStyle.paddingBottom) || 12;
                const minHeight = lineHeight * minRows + paddingTop + paddingBottom;

                // Calculate new height
                // We use scrollHeight to capture the full content height.
                const newHeight = Math.max(textarea.scrollHeight, minHeight);
                const newHeightPx = `${newHeight}px`;

                textarea.style.height = newHeightPx;
            }
        };

        // Adjust height when content changes (textarea is always in DOM now)
        useLayoutEffect(() => {
            adjustHeight(true);
        }, [content, minRows]);

        // Also adjust on window resize
        useEffect(() => {
            const handleResize = () => {
                if (activeTab === "write") adjustHeight(false);
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [activeTab]);

        const handleInput = () => {
            adjustHeight();
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
            adjustHeight();
            if (onChange) {
                onChange(e);
            }
        };

        return (
            <div className={className}>
                {/* Label */}
                {label && (
                    <div className="mb-2 flex items-center justify-between">
                        <label className="font-edu font-semibold text-secondary dark:text-white">
                            {label} {required && <span className="text-primary">*</span>}
                        </label>
                        <div className="flex items-center gap-1 font-edu text-xs text-secondary/60 dark:text-white/60">
                            <IoCodeSlashOutline className="text-sm" />
                            <span>Markdown supported</span>
                        </div>
                    </div>
                )}

                {/* Tab Switcher */}
                <div className="mb-3 flex gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-dosis text-sm font-semibold transition-all ${activeTab === "write"
                            ? "bg-primary border-2 border-secondary text-secondary shadow-[0_0_8px_1px] shadow-primary"
                            : "bg-primary/10 border-2 dark:border-white/20 border-primary text-secondary hover:bg-primary/20 dark:bg-[rgba(255,255,255,.2)] dark:text-white"
                            }`}
                    >
                        <IoCreateOutline className="text-base" />
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-dosis text-sm font-semibold transition-all ${activeTab === "preview"
                            ? "bg-primary border-2 border-secondary text-secondary shadow-[0_0_8px_1px] shadow-primary"
                            : "bg-primary/10 border-2 dark:border-white/20 border-primary text-secondary hover:bg-primary/20 dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:hover:bg-white/20"
                            }`}
                    >
                        <IoEyeOutline className="text-base" />
                        Preview
                    </button>
                </div>

                {/* Editor / Preview Container */}
                <div
                    className={`relative overflow-hidden rounded-xl border-2 transition-colors ${error
                        ? "border-red-400"
                        : "border-primary dark:border-white dark:border-opacity-[0.3]"
                        }`}
                >
                    {/* Write Tab - Always rendered, visually hidden when not active but remains measurable */}
                    <div
                        className={`bg-primary/5 dark:bg-[rgba(255,255,255,.2)] transition-opacity duration-150 ${activeTab === "write"
                            ? "relative opacity-100"
                            : "absolute top-0 left-0 right-0 opacity-0 pointer-events-none"
                            }`}
                    >
                        <textarea
                            ref={internalRef}
                            name={name}
                            value={content}
                            onChange={handleChange}
                            onInput={handleInput}
                            onBlur={onBlur}
                            disabled={disabled}
                            placeholder={placeholder}
                            rows={minRows}
                            className={`
                                w-full resize-none overflow-hidden bg-transparent px-4 py-3 
                                font-mono text-sm text-secondary placeholder-secondary/50 
                                outline-none transition-all 
                                dark:text-white placeholder:font-poppins dark:placeholder-white/70
                                ${disabled ? "cursor-not-allowed opacity-60" : ""}
                            `}
                        />
                    </div>

                    {/* Preview Tab - Always rendered, hidden when not active */}
                    <div
                        className={`min-h-[200px] overflow-hidden bg-white dark:bg-[#0d1117] ${activeTab === "preview"
                            ? "relative opacity-100"
                            : "absolute top-0 left-0 right-0 opacity-0 pointer-events-none"
                            }`}
                    >
                        {/* Preview header bar - GitHub style */}
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-[#30363d] dark:bg-[#161b22]">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                </div>
                                <span className="font-dosis text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Preview
                                </span>
                            </div>
                            <IoEyeOutline className="text-sm text-gray-400 dark:text-gray-500" />
                        </div>

                        {/* Content area */}
                        <div className="relative px-5 py-4">
                            {content ? (
                                <div
                                    className="prose prose-sm max-w-none prose-headings:font-dosis prose-headings:text-[#1f2328] dark:prose-headings:text-[#e6edf3] prose-p:text-[#1f2328] dark:prose-p:text-[#e6edf3] prose-strong:text-[#1f2328] dark:prose-strong:text-primary prose-code:rounded prose-code:bg-[#afb8c133] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#1f2328] prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-[#6e768166] dark:prose-code:text-[#e6edf3] prose-pre:bg-[#f6f8fa] prose-pre:rounded-md dark:prose-pre:bg-[#161b22] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:text-[#1f2328] dark:prose-ul:text-[#e6edf3] prose-ol:text-[#1f2328] dark:prose-ol:text-[#e6edf3] prose-li:marker:text-[#57606a] dark:prose-li:marker:text-primary prose-blockquote:border-l-[#d0d7de] prose-blockquote:text-[#57606a] dark:prose-blockquote:border-l-[#30363d] dark:prose-blockquote:text-[#848d97] prose-img:inline prose-img:m-0 prose-img:align-middle prose-table:border-collapse prose-th:border prose-th:border-[#d0d7de] prose-th:bg-[#f6f8fa] prose-th:px-3 prose-th:py-2 prose-th:text-[#1f2328] dark:prose-th:border-[#30363d] dark:prose-th:bg-[#161b22] dark:prose-th:text-primary prose-td:border prose-td:border-[#d0d7de] prose-td:px-3 prose-td:py-2 prose-td:text-[#1f2328] dark:prose-td:border-[#30363d] dark:prose-td:text-[#e6edf3] prose-hr:border-[#d0d7de] dark:prose-hr:border-[#30363d] [&_p]:!my-2 [&_img+img]:ml-1"
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-[#21262d]">
                                        <IoEyeOutline className="text-2xl text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="font-dosis text-lg font-semibold text-[#1f2328] dark:text-[#e6edf3]">
                                        No Preview Available
                                    </p>
                                    <p className="mt-1 font-poppins text-xs text-[#57606a] dark:text-[#848d97]">
                                        Start writing in the Write tab to see your content rendered here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Helper Text / Error */}
                {(helperText || error) && (
                    <p
                        className={`mt-1 flex items-center gap-1 font-edu text-xs ${error ? "text-red-500" : "text-secondary/60 dark:text-white/60"
                            }`}
                    >
                        {error && (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                        {error || helperText}
                    </p>
                )}

                {/* Markdown Tips */}
                <div className="mt-2 flex flex-wrap font-dosis gap-2 text-xs text-secondary dark:text-white">
                    {["**bold**", "*italic*", "`code`", "- list item", "1. numbered", "# heading", "[link](url)"].map((tip) => (
                        <span key={tip} className="rounded border border-primary bg-primary/5 px-1.5 py-0.5 dark:border-white/20 dark:bg-[rgba(255,255,255,.2)]">
                            {tip}
                        </span>
                    ))}
                </div>
            </div>
        );
    }
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
