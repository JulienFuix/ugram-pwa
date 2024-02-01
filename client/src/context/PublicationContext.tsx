import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import app, { HTTPRequest } from "../api/feathers-config";
import { AllPostObject } from "../types/AllPostObject";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PublicationWrapperInterface {
  children: React.ReactNode;
}

interface PublicationContextInterface {
  isLoading: boolean;
  createPublications: (description: string, files: any, hashtags: any) => any;
  getAllPublication: () => AllPostObject | any;
  post: AllPostObject;
  modifyPost: (description: string, id: string) => any;
  deletePost: (id: string) => any;
  getPostsById: (id: string) => Post | any;
  likesPublication: (id: string) => any;
  unlikesPublication: (id: string) => any;
  createComments: (id: string, _content: string) => any;
  getComments: (id: string) => any;
  removeComment: (id: string) => any;
  getLikesPublication: (id: string) => any;
  AllComments: Array<Comment>;
}

const PublicationContext = createContext({} as PublicationContextInterface);

export const PublicationWrapper = ({
  children,
}: PublicationWrapperInterface) => {
  const [isLoading, setIsLoading] = useState(false);
  const [post, setAllPost] = useState<AllPostObject | any>();
  const [AllComments, setAllComments] = useState<Array<Comment> | any>([]);

  const createPublications = async (
    description: string,
    files: any,
    hashtags: any
  ) => {
    try {
      setIsLoading(true);

      var formdata = new FormData();
      formdata.append("description", description);
      formdata.append("file", files[0]);
      hashtags.map((element: any) => {
        formdata.append("hashtags[]", element.slice(1));
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${url}/publications`,
        data: formdata,
      };

      axios(config).then(function () {
        setIsLoading(false);
      });
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const modifyPost = async (description: string, id: string) => {
    try {
      setIsLoading(true);

      var data = JSON.stringify({
        description: description,
      });

      var config = {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
        },
        url: `${url}/publications/${id}`,
        data: data,
      };

      axios(config).then(function () {
        setIsLoading(false);
      });
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setIsLoading(true);

      var config = {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        url: `${url}/publications/${id}`,
      };

      axios(config).then(function () {
        setIsLoading(false);
      });
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const getPostsById = async (id: string) => {
    try {
      setIsLoading(true);

      const res = await HTTPRequest("get", "publications", {
        _id: id,
      });
      setIsLoading(false);
      return (res);
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const getAllPublication = async () => {
    try {
      const res = await HTTPRequest("find", "publications");
      setAllPost(res);
      return res;
    } catch (e: any) {
      console.log("error", e);
    }
  };

  const getLikesPublication = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await HTTPRequest("find", "likes", {
        query: {
          publication_id: id,
        },
      });
      setIsLoading(false);
      return res;
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const likesPublication = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await HTTPRequest("create", "likes", {
        data: {
          publication_id: id,
        },
      });
      setIsLoading(false);
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const unlikesPublication = async (id: string) => {
    try {
      setIsLoading(true);
      let res = await HTTPRequest("remove", "likes", {
        _id: "",
        query: {
          publication_id: id
        }
      })
      setIsLoading(false);
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const createComments = async (id: string, _content: string) => {
    try {
      setIsLoading(true);
      const res = await HTTPRequest("create", "comments", {
        data: {
          publication_id: id,
          content: _content,
        },
      });
      setIsLoading(false);
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const getComments = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await HTTPRequest("find", "comments", {
        query: {
          publication_id: id,
        },
      });
      setIsLoading(false);
      setAllComments(res);
      console.log("COMMENT", res);
      return res;
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  const removeComment = async (id: string) => {
    try {
      setIsLoading(true);
      let res = await HTTPRequest("remove", "comments", {
        _id: id,
      })
      setIsLoading(false);
    } catch (e: any) {
      console.log("error", e);
      setIsLoading(false);
    }
  };

  function getAllComments(comments: any) {
    getComments(comments.publication_id);
  }

  useEffect(() => {
    app.service('comments').on('created', (comments: any) => getAllComments(comments));
  }, []);

  return (
    <PublicationContext.Provider
      value={{
        isLoading,
        createPublications,
        getAllPublication,
        post,
        modifyPost,
        deletePost,
        getPostsById,
        likesPublication,
        unlikesPublication,
        createComments,
        getComments,
        removeComment,
        getLikesPublication,
        AllComments,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export default PublicationWrapper;

export function usePublication(): PublicationContextInterface {
  return useContext(PublicationContext);
}
