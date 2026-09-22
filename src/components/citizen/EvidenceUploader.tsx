import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import { ReportMedia } from '../../types/report';

interface EvidenceUploaderProps {
  media: ReportMedia[];
  onMediaChange: (media: ReportMedia[]) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  media,
  onMediaChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaItems: ReportMedia[] = [];

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      newMediaItems.push({
        id: `media-${Date.now()}-${index}`,
        name: file.name,
        url,
        type: isVideo ? 'video' : 'image',
        size: `${sizeMb} MB`,
      });
    });

    onMediaChange([...media, ...newMediaItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onMediaChange(media.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#182315]">
          Add Evidence
        </label>
        <span className="text-[11px] text-[#697A62]">Photo or Video</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Clickable Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#D2DEC6] hover:border-[#4D602B] bg-[#FAFBF8] hover:bg-[#F3F7EE] rounded-2xl p-6 text-center cursor-pointer transition-colors duration-150 flex flex-col items-center justify-center group"
      >
        <div className="w-11 h-11 rounded-full bg-[#EEF4E5] group-hover:bg-[#435322] group-hover:text-white text-[#435322] flex items-center justify-center mb-2.5 transition-colors">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#182315]">
          + Add Photos or Videos
        </p>
        <p className="text-[11px] sm:text-xs text-[#63745C] mt-0.5">
          Photos or videos can help explain the problem.
        </p>
      </div>

      {/* Selected Media Thumbnails & List */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative group bg-white rounded-xl border border-[#DCE4D3] overflow-hidden p-2 shadow-2xs"
            >
              <div className="w-full h-24 bg-[#F2F5ED] rounded-lg overflow-hidden flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#4A5D2E]">
                    <Film className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">Video</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
                  title="Remove media"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-1.5 px-0.5 flex items-center justify-between text-[11px] text-[#55654E]">
                <span className="truncate max-w-[120px]" title={item.name}>
                  {item.name}
                </span>
                {item.size && <span className="text-[10px] text-[#7C8D76]">{item.size}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
