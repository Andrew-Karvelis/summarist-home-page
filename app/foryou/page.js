import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import Recommended from "@/components/foryou/Recommended";
import Selected from "@/components/foryou/Selected";
import Suggested from "@/components/foryou/Suggested";
import React from "react";

export default async function ForYouPage() {
  const initialData = await fetchInitalBooks();

  return (
    <div id="__next">
      <div className="wrapper">
        <Search initialData={initialData} />
        <Sidebar />
        <div className="row">
          <div className="container">
            <div className="foryou__wrapper">
              <Selected books={initialData.selected} />
              <Recommended books={initialData.recommended} />
              <Suggested books={initialData.suggested}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchInitalBooks() {
  const urls = [
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
    "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
  ];

  const responses = await Promise.all(urls.map((url) => fetch(url)));

  const data = await Promise.all(responses.map((res) => res.json()));

  return {
    recommended: data[0],
    selected: data[1],
    suggested: data[2],
  }
}