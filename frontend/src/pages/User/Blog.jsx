import React from "react";
import BaseUser from "../Base/BaseUser";

const Blog = () => {
  return (
    <BaseUser>
        <h1 className="text-4xl font-bold text-green-400 mb-6">Our Blog</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Stay updated with the latest trends in sports, fitness tips, and PlayNation updates. 
          Read our expert articles on improving your game and staying fit!
        </p>
    </BaseUser>
  );
};

export default Blog;
