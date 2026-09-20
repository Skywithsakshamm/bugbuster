import React, { useState } from 'react';
import { X, Folder, Upload, FileCode, Check, AlertCircle } from 'lucide-react';
import { bugbusterService } from '../services/bugbusterService';

interface ConnectRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (repoData: {
    owner: string;
    name: string;
    branch: string;
    language: string;
  }) => void;
}

export const ConnectRepoModal: React.FC<ConnectRepoModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [loadType, setLoadType] = useState<'path' | 'zip' | 'raw'>('path');
  const [localPath, setLocalPath] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [rawCode, setRawCode] = useState('');
  const [rawFilename, setRawFilename] = useState('main.py');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loadType === 'path') {
        if (!localPath.trim()) {
          throw new Error('Please specify a valid repository path.');
        }
        await bugbusterService.loadRepository({
          path: localPath.trim(),
          raw_code: null,
          raw_filename: 'main.py',
          diff: null,
          zip_path: null,
          zip_bytes: null
        });
      } else if (loadType === 'zip') {
        if (!zipFile) {
          throw new Error('Please select a ZIP file to upload.');
        }
        await bugbusterService.uploadZip(zipFile);
      } else if (loadType === 'raw') {
        if (!rawCode.trim()) {
          throw new Error('Please provide raw source code.');
        }
        await bugbusterService.loadRepository({
          path: null,
          raw_code: rawCode,
          raw_filename: rawFilename || 'main.py',
          diff: null,
          zip_path: null,
          zip_bytes: null
        });
      }

      // Check loaded status
      const status = await bugbusterService.getStatus();
      const rootPath = status.summary?.root_path || localPath || 'workspace';
      const parts = rootPath.replace(/\\/g, '/').split('/').filter(Boolean);
      const name = parts[parts.length - 1] || 'current-repo';
      const owner = parts.length > 1 ? parts[parts.length - 2] : 'local';

      onConnect({
        owner,
        name,
        branch: 'main',
        language: status.summary?.language || 'Python'
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to load repository into BugBuster backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#121620] border border-[#262f3f] rounded-xl max-w-md w-full p-6 shadow-2xl text-zinc-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#212733]">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-mono">Load Repository</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-[#1a202c]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Load Method Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setLoadType('path')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-mono text-center transition-colors ${
              loadType === 'path'
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-[#181e28] text-zinc-400 hover:text-white'
            }`}
          >
            Local Path
          </button>
          <button
            type="button"
            onClick={() => setLoadType('zip')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-mono text-center transition-colors ${
              loadType === 'zip'
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-[#181e28] text-zinc-400 hover:text-white'
            }`}
          >
            ZIP Upload
          </button>
          <button
            type="button"
            onClick={() => setLoadType('raw')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-mono text-center transition-colors ${
              loadType === 'raw'
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-[#181e28] text-zinc-400 hover:text-white'
            }`}
          >
            Raw Code
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loadType === 'path' && (
            <div>
              <label className="block text-zinc-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">
                Server Directory Path
              </label>
              <input
                type="text"
                required
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                placeholder="/path/to/project or ."
                className="w-full bg-[#181d26] border border-[#2b3342] rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Calls <code>POST /api/repository/load</code> with local file system path.
              </span>
            </div>
          )}

          {loadType === 'zip' && (
            <div>
              <label className="block text-zinc-400 uppercase tracking-wider mb-1.5 font-semibold text-[11px]">
                Repository ZIP Archive
              </label>
              <input
                type="file"
                accept=".zip"
                required
                onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                className="w-full bg-[#181d26] border border-[#2b3342] rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-indigo-600 file:text-white"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Uploaded via multipart/form-data to <code>POST /api/repository/upload-zip</code>.
              </span>
            </div>
          )}

          {loadType === 'raw' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1 font-semibold text-[11px]">
                  Filename
                </label>
                <input
                  type="text"
                  value={rawFilename}
                  onChange={(e) => setRawFilename(e.target.value)}
                  placeholder="main.py"
                  className="w-full bg-[#181d26] border border-[#2b3342] rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 uppercase tracking-wider mb-1 font-semibold text-[11px]">
                  Code Content
                </label>
                <textarea
                  rows={5}
                  value={rawCode}
                  onChange={(e) => setRawCode(e.target.value)}
                  placeholder="# Paste code snippet to analyze..."
                  className="w-full bg-[#181d26] border border-[#2b3342] rounded-md p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-md bg-[#181e28] text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium shadow-sm transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading Repository...</span>
                </>
              ) : (
                <span>Load Repository</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
