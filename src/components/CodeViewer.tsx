import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  filename?: string;
  startLineNumber?: number;
  highlightLines?: number[];
  title?: string;
  badge?: string;
  badgeColor?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = 'python',
  filename,
  startLineNumber = 1,
  highlightLines = [],
  title,
  badge,
  badgeColor = 'bg-red-500/20 text-red-300 border-red-500/30'
}) => {
  const [copied, setCopied] = React.useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#262c36] bg-[#0d1117] overflow-hidden text-xs font-mono shadow-sm">
      {/* Header bar */}
      {(filename || title || badge) && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-[#21262d] select-none">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            {filename && <span className="font-semibold text-zinc-200">{filename}</span>}
            {title && <span className="text-zinc-400">({title})</span>}
            {badge && (
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400">{language}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:bg-[#262c36] text-zinc-400 hover:text-white transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Code body */}
      <div className="overflow-x-auto py-2">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const currentLineNumber = startLineNumber + idx;
              const isHighlighted = highlightLines.includes(currentLineNumber);

              return (
                <tr 
                  key={idx} 
                  className={`leading-relaxed hover:bg-[#161b22]/70 ${
                    isHighlighted ? 'bg-red-500/10 border-l-2 border-red-500' : ''
                  }`}
                >
                  <td className="w-12 px-3 text-right select-none text-zinc-400 font-mono text-[11px] border-r border-[#21262d]">
                    {currentLineNumber}
                  </td>
                  <td className="px-4 py-0.5 whitespace-pre font-mono text-zinc-200">
                    <span className={isHighlighted ? 'text-red-300 font-medium' : ''}>
                      {line}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
