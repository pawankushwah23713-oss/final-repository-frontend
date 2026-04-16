"use client";
import { useState } from "react";
import StatusList from "./StatusList";
import StoryViewer from "./StoryViewer";
import StatusUploaderUI from "./StatusUploaderUI";

export default function Home() {
  const [viewer, setViewer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [openUpload, setOpenUpload] = useState(false);

  const refresh = () => setRefreshKey((p) => p + 1);

  return (
    <div className="max-w-md mx-auto">

      <h1 className="text-xl font-bold p-3">Status App</h1>

      <StatusList
        refreshKey={refreshKey}
        onSelect={(index, statuses) =>
          setViewer({ index, statuses })
        }
      />

      {/* Floating Button */}
         <button
  onClick={() => setOpenUpload(true)}
  className="
    fixed 
    bottom-6 
    right-6 
    z-50
    bg-green-500 
    text-white 
    w-14 h-14 
    rounded-full 
    text-2xl 
    flex items-center justify-center
    shadow-lg
    active:scale-95
  "
>
  +
</button>

      {openUpload && (
        <StatusUploaderUI
          onClose={() => setOpenUpload(false)}
          refresh={refresh}
        />
      )}

     {viewer && (
  <StoryViewer
    statuses={viewer.statuses}
    startIndex={viewer.index}
    onClose={() => setViewer(null)}
    onDelete={refresh}   // 🔥 ADD THIS
  />
)}
    </div>
  );
}