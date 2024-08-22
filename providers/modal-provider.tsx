"use client";

import { Fragment, useEffect, useState } from "react";

import { SearchModal } from "@/components/modals/search-modal";

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
    </Fragment>
  );
};
