import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Kortreist Mat - Finn lokal mat nær deg';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFDF5',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Border */}
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        right: 20,
                        bottom: 20,
                        border: '4px solid black',
                        display: 'flex',
                    }}
                />

                {/* Pink accent box */}
                <div
                    style={{
                        position: 'absolute',
                        top: 60,
                        left: 60,
                        width: 80,
                        height: 80,
                        backgroundColor: '#FF90E8',
                        border: '3px solid black',
                        transform: 'rotate(12deg)',
                        display: 'flex',
                    }}
                />

                {/* Cyan accent box */}
                <div
                    style={{
                        position: 'absolute',
                        top: 80,
                        right: 80,
                        width: 60,
                        height: 60,
                        backgroundColor: '#00D2FF',
                        border: '3px solid black',
                        transform: 'rotate(-12deg)',
                        display: 'flex',
                    }}
                />

                {/* Logo icon */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                        height: 100,
                        backgroundColor: '#FF90E8',
                        border: '4px solid black',
                        marginBottom: 30,
                    }}
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                            fill="white"
                            stroke="black"
                            strokeWidth="2"
                        />
                        <circle cx="12" cy="9" r="2.5" fill="#FF90E8" stroke="black" strokeWidth="1.5" />
                    </svg>
                </div>

                {/* Title */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 72,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        color: 'black',
                    }}
                >
                    Kortreist Mat
                </div>

                {/* Tagline */}
                <div
                    style={{
                        display: 'flex',
                        fontSize: 28,
                        fontWeight: 700,
                        color: 'black',
                        marginTop: 20,
                        backgroundColor: 'white',
                        padding: '12px 24px',
                        border: '3px solid black',
                    }}
                >
                    Finn lokal mat direkte fra bonden
                </div>

                {/* Bottom accent */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 60,
                        display: 'flex',
                        gap: 16,
                    }}
                >
                    <div style={{ display: 'flex', padding: '8px 16px', backgroundColor: '#CCFF00', border: '2px solid black', fontSize: 18, fontWeight: 700 }}>
                        RÅMELK
                    </div>
                    <div style={{ display: 'flex', padding: '8px 16px', backgroundColor: '#FFD700', border: '2px solid black', fontSize: 18, fontWeight: 700 }}>
                        HONNING
                    </div>
                    <div style={{ display: 'flex', padding: '8px 16px', backgroundColor: '#FF90E8', border: '2px solid black', fontSize: 18, fontWeight: 700 }}>
                        KJØTT
                    </div>
                    <div style={{ display: 'flex', padding: '8px 16px', backgroundColor: '#00D2FF', border: '2px solid black', fontSize: 18, fontWeight: 700 }}>
                        FISK
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
