import React from "react";
import { AccountModal } from "src/containers/Modals/AccountModal";
import { ClearModal } from "src/containers/Modals/ClearModal";
import { CloudModal } from "src/containers/Modals/CloudModal";
import { DownloadModal } from "src/containers/Modals/DownloadModal";
import { ImportModal } from "src/containers/Modals/ImportModal";
import { LoginModal } from "src/containers/Modals/LoginModal";
import { SettingsModal } from "src/containers/Modals/SettingsModal";
import { ShareModal } from "src/containers/Modals/ShareModal";
import useModal from "src/store/useModal";
import { shallow } from "zustand/shallow";

export const ModalController = () => {
  const setVisible = useModal(state => state.setVisible);

  const [
    importModal,
    clearModal,
    downloadModal,
    settingsModal,
    cloudModal,
    accountModal,
    loginModal,
    shareModal,
  ] = useModal(
    state => [
      state.import,
      state.clear,
      state.download,
      state.settings,
      state.cloud,
      state.account,
      state.login,
      state.share,
    ],
    shallow
  );

  return (
    <>
      <ImportModal opened={importModal} onClose={() => setVisible("import")(false)} />
      <ClearModal opened={clearModal} onClose={() => setVisible("clear")(false)} />
      <DownloadModal opened={downloadModal} onClose={() => setVisible("download")(false)} />
      <SettingsModal opened={settingsModal} onClose={() => setVisible("settings")(false)} />
      <CloudModal opened={cloudModal} onClose={() => setVisible("cloud")(false)} />
      <AccountModal opened={accountModal} onClose={() => setVisible("account")(false)} />
      <LoginModal opened={loginModal} onClose={() => setVisible("login")(false)} />
      <ShareModal opened={shareModal} onClose={() => setVisible("share")(false)} />
    </>
  );
};
