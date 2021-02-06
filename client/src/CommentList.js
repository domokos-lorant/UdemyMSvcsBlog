import React, { useEffect, useState } from "react";

const CommentList = ({ comments }) => {
   const renderedComments = comments
      .map(comment => {
         return (
            <li key={comment.id}>
               {comment.content}
            </li>
         );
      });

   return (
      <div className="d-flex flex-row flex-wrap justify-content-between">
         {renderedComments}
      </div>
   );
};

export default CommentList;