import { useEffect } from "react";

export default function Notes({ notes, width, scrollSpeed,setCurrentTime}) {
    const whiteKeyCount = 52;
    const whiteKeyWidth = width / whiteKeyCount;

    const isBlack = (midi) => [1, 3, 6, 8, 10].includes(midi % 12);
    const getWhiteIndex = (midi) => {
        let index = 0;
        for (let i = 21; i < midi; i++) {
            if (!isBlack(i)) index++;
        }
        return index;
    };

    const maxTime = notes.length > 0
        ? Math.max(...notes.map(n => n.time + n.duration))
        : 0;

    const scrollableHeight = maxTime * scrollSpeed;

    // Scroll to bottom when notes change
    useEffect(() => {
        if (notes.length) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
        }
    }, [notes]);

    function noteColor(isB, track) {
        if (track === 1) {
            // Left hand: Blue palette
            return isB ? "#1565C0" : "#42A5F5";
        } else {
            // Right hand: Green palette
            return isB ? "#2E7D32" : "#66BB6A";
        }
    }

    useEffect(() => {
        if (window.innerWidth < 400) return;

        const saveScroll = () => {
            localStorage.setItem("pianoScrollY", window.scrollY.toString());
        };

        window.addEventListener("scroll", saveScroll);
        return () => window.removeEventListener("scroll", saveScroll);
    }, []);


    useEffect(() => {
        if (notes.length) {
            const saved = localStorage.getItem("pianoScrollY");
            const y = saved ? parseInt(saved) : document.body.scrollHeight;
            window.scrollTo({ top: y, behavior: "auto" });
        }
    }, [notes]);


    return (
        <div
            id="piano-notes"
            style={{
                height: scrollableHeight
            }}
        >
            {notes.map((note, i) => {
                const isB = isBlack(note.midi);
                const h = note.duration * scrollSpeed;
                const y = scrollableHeight - (note.time + note.duration) * scrollSpeed;

                const whiteIndex = getWhiteIndex(note.midi);
                const left = isB
                    ? whiteIndex * whiteKeyWidth - whiteKeyWidth * 0.3
                    : whiteIndex * whiteKeyWidth;
                const noteWidth = isB ? whiteKeyWidth * 0.6 : whiteKeyWidth;

                return (
                    <div
                    onClick={()=>{
                       setCurrentTime(note.time+note.duration/2);
                    }}
                        className="piano-note"
                        key={i}
                        style={{
                            position: "absolute",
                            left,
                            top: y,
                            width: noteWidth,
                            height: h,
                            backgroundColor: noteColor(isB, note?.track),
                            borderRadius: 10,
                            zIndex: isB ? 2 : 1,
                        }}
                    />
                );
            })}
        </div>

    );
}
