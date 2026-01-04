import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser } from 'lucide-react';

interface Props {
    onChange: (dataUrl: string) => void;
    label: string;
}

export default function SignaturePad({ onChange, label }: Props) {
    const sigCanvas = useRef<any>({});

    const clear = (e: React.MouseEvent) => {
        e.preventDefault();
        sigCanvas.current.clear();
        onChange('');
    };

    const handleEnd = () => {
        onChange(sigCanvas.current.toDataURL());
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <button onClick={clear} className="text-sm text-red-500 flex items-center gap-1 hover:text-red-700">
                    <Eraser className="w-4 h-4" /> Clear
                </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white hover:border-brand-teal transition-colors">
                <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                        className: 'w-full h-40',
                    }}
                    onEnd={handleEnd}
                    penColor="black"
                />
            </div>
            <p className="text-xs text-gray-400">Sign within the box above.</p>
        </div>
    );
}
