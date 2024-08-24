"use client";

import { Fragment, useEffect, useState } from "react";

import { SearchModal } from "@/components/modals/search-modal";
import { CategoryModal } from "@/components/modals/category-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Fragment>
      <SearchModal />
      <CategoryModal />
    </Fragment>
  );
};
