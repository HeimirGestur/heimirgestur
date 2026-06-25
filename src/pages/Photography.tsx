import { useEffect, useState, useCallback, useRef } from "react";
import { Layout } from "@/components/layout/Layout";

const photos = [
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385315/20750011small_rq2hfb.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385693/1small_jqu2y2.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385692/22small_dl18dn.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385692/16small2_cdvugm.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385315/20750024small_injax2.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385315/20720006small_pnrac9.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385315/20750006small_ksojsq.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385693/13small_eperfr.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385694/6_apgzmt.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385694/7small_qsbxjr.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385694/23small_ooz036.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385693/8small_bs9zyk.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385694/16small_iutn4l.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385695/24small_gzafoc.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782388087/7small22_u2hspc.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782388088/8small2_fakncv.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385314/20750009small_nlw1js.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385314/18360014small_cvl0gf.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385314/18360012_small_pbevnt.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385314/18360013small_ur14u4.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385313/18360029small_wi2ufw.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385314/18360002small_gcfswp.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385313/18350011small_q1xyv2.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385313/18360007small_m0bify.jpg",
  "https://res.cloudinary.com/dltrwdadi/image/upload/v1782385313/18360006small_ehsjny.jpg",
];

const Photography = () => {
  const [index, setIndex] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);


  const next = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, []);

  const goNext = useCallback(() => {
    next();
    resetAuto();
  }, [next]);

  const goPrev = useCallback(() => {
    prev();
    resetAuto();
  }, [prev]);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 3000);
  }, []);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [resetAuto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Preload neighbors
  useEffect(() => {
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = photos[(index + d + photos.length) % photos.length];
    });
  }, [index]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) goPrev();
    else goNext();
  };

  return (
    <Layout>
      <div className="fixed inset-0 flex items-center justify-center bg-background pt-16 pb-12 px-4">
        <div
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full cursor-pointer select-none"
          style={{ cursor: "none", touchAction: "pan-y" }}
          onMouseMove={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;
            e.currentTarget.style.cursor = x < width / 2 ? "w-resize" : "e-resize";
          }}
        >
          <img
            key={photos[index]}
            src={photos[index]}
            alt={`Photograph ${index + 1}`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Photography;
