import React from "react"

import AppAmplifyUI from "./AppAmplifyUI"
import AppVanilla from "./AppVanilla"

const showAppAmplifyUI= () => {
  if (window.location.pathname === "/") {
    return <AppAmplifyUI/>
  }
}

const showAppVanilla= () => {
  if (window.location.pathname === "/v") {
    return <AppVanilla/>
  }
}

export default function App() {
  return <div className="ui container">
    {showAppAmplifyUI()}
    {showAppVanilla()}
  </div>
}