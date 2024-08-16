import * as React from "react";
import { hot } from "react-hot-loader";
import "./../assets/scss/App.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faTimes, faTrash, faPlus, faPlusCircle, faSearch, faExternalLinkAlt, faClipboardList, faEyeSlash, faFileExport, faKey, faHandPointer, faKeyboard, faMouse, faGraduationCap, faMapMarkerAlt, faQuestionCircle, faCheckCircle, faArrowAltCircleRight, faExpand, faMinus, faRocket } from '@fortawesome/free-solid-svg-icons';
import { Callout, CommandBar, DefaultButton, DelayedRender, Dropdown, ICommandBarItemProps, Icon, IconButton, IDropdownOption, IPivotItemProps, Label, Panel, PanelType, Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, PrimaryButton, registerIcons, Stack, Text, TextField } from "@fluentui/react";
import SmartTable, { SmartTableProps } from "./SmartTable";
import LoadingOverlay from 'react-loading-overlay';
import Split from 'react-split';
import Markdown from 'react-markdown'
import { initializeIcons } from '@uifabric/icons';
import logo from './../assets/img/vitality-logo-2.png';
import gtLogo from './../assets/img/gt-logo.png';
import northwesternLogo from './../assets/img/northwestern-logo.png';
import unccLogo from './../assets/img/uncc-logo.png';
import emoryLogo from './../assets/img/emory-logo.png';
import { observer } from "mobx-react";

import visConferenceLogo from './../assets/img/ieeevis2021-logo.png';
const baseUrl = "http://localhost:3000/";


interface AppProps {
}

export const PaperScatter: React.FC<{props: AppProps}> = observer(({props}) => {

  const [chatHistory, setChatHistory] = React.useState([]);


  return (
    <div className="split p-md p-b-0">
      <div className="history">
        {this.state.chatHistory.map(historyItem => {
          return (
            <div>
              <div> human: {historyItem.human} </div> 
              <div> ai: {historyItem.ai} </div> 
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex' }}>
        <Label style={{ fontSize: "1.2rem" }}> Chat with your data here</Label>
        &nbsp;&nbsp;
        <DefaultButton 
          className="iconButton"
          styles={{root: {padding:0, minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
          onClick={chatRequest}
          iconProps={{iconName: "Rocket"}}
          text={'Ask'}>
        </DefaultButton>
      </div>
      <TextField style={{ marginBottom: "2em" }} multiline rows={10} defaultValue={""} onChange={onChangeChatText} />

      <div>
        <div style={{ display: 'flex' }}>
          <Label style={{ fontSize: "1.2rem" }}> LLM Feedback </Label>
          <div>
            <DefaultButton
              text="ALL"
              iconProps={{iconName: "Locate"}}
              onClick={() => {}} 
              allowDisabledFocus 
              styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
            />
            <DefaultButton
              text="ALL"
              iconProps={{iconName: "PlusCircle"}}
              onClick={() => {}} 
              allowDisabledFocus 
              styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
            />
            <DefaultButton
              text="ALL"
              iconProps={{iconName: "Save"}}
              onClick={() => {}} 
              allowDisabledFocus 
              styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
            />
          </div>
        </div>

        <div>
        {
          this.state.chatSelectedPaper.length > 0 &&
          <div>
            <span style={{fontWeight: 900}}>Current Selected Paper:</span> 
            <span style={{color: 'blue'}}>{this.state.chatSelectedPaper}</span>
            <span>
              <DefaultButton
                iconProps={{iconName: "Locate"}}
                onClick={() => {
                  let papers = this.state.dataAll.filter(i => i.Title === `${this.state.chatSelectedPaper}.`)
                  if (papers.length > 0) {
                    addToSelectNodeIDs(papers.map((d) => d["ID"]), "scatterplot")
                  }
                }} 
                allowDisabledFocus 
                styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
              />
              <DefaultButton
                iconProps={{iconName: "PlusCircle"}}
                onClick={() => {
                  let papers = this.state.dataAll.filter(i => i.Title === `${this.state.chatSelectedPaper}.`)
                  if (papers.length > 0) {
                    addToSimilarInputPapers(papers[0])
                  }
                }} 
                allowDisabledFocus 
                styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
              />
              <DefaultButton
                iconProps={{iconName: "Save"}}
                onClick={() => {
                  let papers = this.state.dataAll.filter(i => i.Title === `${this.state.chatSelectedPaper}.`)
                  if (papers.length > 0) {
                    addToSavedPapers(papers[0])
                  }
                }} 
                allowDisabledFocus 
                styles={{root: {padding:0, margin: '0 0.5em', minWidth: 0, display: "inline-block", verticalAlign: "top"}, icon: {color: "#116EBE"}}}
              />
            </span>
          </div>
        }
        </div>

        <Markdown
          components={{
            strong: ({node, ...props}) => {
              return (
                <span
                  id={`${props.children[0]}`}
                  style={{color: 'blue', fontWeight: 'bold', cursor: 'pointer' }} {...props} 
                  onClick={() => {
                    this.setState({chatSelectedPaper: `${props.children[0]}`})
                  }}
                />
              )
            }
          }}
        >{this.state.chatResponse}</Markdown>
      </div>
    </div>
  )
})