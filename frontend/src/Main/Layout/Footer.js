import React from "react";

export default function Footer(){

  const year = new Date().getFullYear();

  return(

      <div class="fixed-bottom clearfix mt-4 pb-3 bedrock-footer">
        <div class="copyright">
          &copy; Copyright <strong><span>bedrock-summariser</span></strong>. All Rights Reserved
        </div>
        <div class="credits">
          <a> Website Developer: Oli Leach - AWS Principal Solution Architect</a>
        </div>
      </div>

  )
};

