import Recommended from "@/components/foryou/Recommended";
import Selected from "@/components/foryou/Selected";
import Suggested from "@/components/foryou/Suggested";
import React from "react";

export default function ForYouPage() {
  return (
    <div className="row">
      <div className="container">
        <div className="foryou__wrapper">
          <Selected />
          <Recommended />
          <Suggested />
        </div>
      </div>
    </div>
  );
}
