import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import Recommended from "@/components/foryou/Recommended";
import Selected from "@/components/foryou/Selected";
import Suggested from "@/components/foryou/Suggested";
import fetchInitialBooks from "@/lib/fetchInitialBooks";
import React from "react";

export default async function ForYouPage() {
  const initialData = await fetchInitialBooks();


  return (
    <div id="__next">
      <div className="wrapper">
        <Search initialData={initialData} />
        <Sidebar />
        <div className="row">
          <div className="container">
            <div className="foryou__wrapper">
              <h1>API website currently down. Sit back, relax and enjoy the skeleton loading states</h1>
              <Selected books={initialData.selected} />
              <Recommended books={initialData.recommended} />
              <Suggested books={initialData.suggested} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}