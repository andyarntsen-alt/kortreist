"use client";

import { useState } from "react";
import { Share2, Copy, Check, Facebook, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    url: string;
    title: string;
    description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareData = {
        title,
        text: description || title,
        url,
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled or error
            }
        } else {
            setIsOpen(true);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFacebookShare = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
    };

    const handleSmsShare = () => {
        const smsBody = `${title}: ${url}`;
        window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
    };

    return (
        <div className="relative">
            <Button
                onClick={handleNativeShare}
                variant="outline"
                className="flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
                <Share2 className="h-4 w-4" />
                Del
            </Button>

            {/* Share Modal */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-lg uppercase">Del</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded touch-manipulation"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 p-3 border-2 border-black bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
                            >
                                {copied ? (
                                    <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                                <span className="font-bold">
                                    {copied ? "Kopiert!" : "Kopier lenke"}
                                </span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={handleFacebookShare}
                                className="w-full flex items-center gap-3 p-3 border-2 border-black bg-[#1877F2] text-white hover:bg-[#166FE5] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="font-bold">Del på Facebook</span>
                            </button>

                            {/* SMS */}
                            <button
                                onClick={handleSmsShare}
                                className="w-full flex items-center gap-3 p-3 border-2 border-black bg-[#34C759] text-white hover:bg-[#2DB84D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="font-bold">Send som melding</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
