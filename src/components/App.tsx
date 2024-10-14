import * as React from "react";
import {hot} from "react-hot-loader";
import "./../assets/scss/App.scss";
import PaperScatter from "./PaperScatter";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Tabs, Tab, Button, Nav} from 'react-bootstrap'; // <-- Add this line
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- Ensure this line is already present for Bootstrap styles

import {
    faCaretDown,
    faCaretUp,
    faTimes,
    faTrash,
    faPlus,
    faPlusCircle,
    faSearch,
    faExternalLinkAlt,
    faClipboardList,
    faEyeSlash,
    faFileExport,
    faKey,
    faHandPointer,
    faKeyboard,
    faMouse,
    faGraduationCap,
    faMapMarkerAlt,
    faQuestionCircle,
    faCheckCircle,
    faArrowAltCircleRight,
    faExpand,
    faMinus,
    faRocket
} from '@fortawesome/free-solid-svg-icons';
import {
    Callout,
    CommandBar,
    DefaultButton,
    DelayedRender,
    Dropdown,
    ICommandBarItemProps,
    Icon,
    IconButton,
    IDropdownOption,
    IPivotItemProps,
    Label,
    Panel,
    PanelType,
    Pivot,
    PivotItem,
    PivotLinkFormat,
    PivotLinkSize,
    PrimaryButton,
    registerIcons,
    Stack,
    Text,
    TextField
} from "@fluentui/react";
import SmartTable, {SmartTableProps} from "./SmartTable";
import LoadingOverlay from 'react-loading-overlay';
import Split from 'react-split';
import Markdown from 'react-markdown'
import {initializeIcons} from '@uifabric/icons';
import logo from './../assets/img/vitality-logo-2.png';
import gtLogo from './../assets/img/gt-logo.png';
import northwesternLogo from './../assets/img/northwestern-logo.png';
import unccLogo from './../assets/img/uncc-logo.png';
import emoryLogo from './../assets/img/emory-logo.png';

import visConferenceLogo from './../assets/img/ieeevis2021-logo.png';
import {Dialog} from "./Dialog";

export const baseUrl = "http://localhost:3000/";

initializeIcons();
registerIcons({
    icons: {
        Rocket: <FontAwesomeIcon icon={faRocket}/>,
        Link: <FontAwesomeIcon icon={faExternalLinkAlt}/>,
        GraduationCap: <FontAwesomeIcon icon={faGraduationCap}/>,
        CaretUp: <FontAwesomeIcon icon={faCaretUp}/>,
        CaretDown: <FontAwesomeIcon icon={faCaretDown}/>,
        Check: <FontAwesomeIcon icon={faCheckCircle}/>,
        Times: <FontAwesomeIcon icon={faTimes}/>,
        ArrowRight: <FontAwesomeIcon icon={faArrowAltCircleRight}/>,
        Delete: <FontAwesomeIcon icon={faTrash}/>,
        Plus: <FontAwesomeIcon icon={faPlus}/>,
        PlusCircle: <FontAwesomeIcon icon={faPlusCircle}/>,
        Search: <FontAwesomeIcon icon={faSearch}/>,
        ExternalLink: <FontAwesomeIcon icon={faExternalLinkAlt}/>,
        ClipboardList: <FontAwesomeIcon icon={faClipboardList}/>,
        EyeSlash: <FontAwesomeIcon icon={faEyeSlash}/>,
        FileExport: <FontAwesomeIcon icon={faFileExport}/>,
        Locate: <FontAwesomeIcon icon={faMapMarkerAlt}/>,
        Key: <FontAwesomeIcon icon={faKey}/>,
        HandPointer: <FontAwesomeIcon icon={faHandPointer}/>,
        Mouse: <FontAwesomeIcon icon={faMouse}/>,
        Keyboard: <FontAwesomeIcon icon={faKeyboard}/>,
        Question: <FontAwesomeIcon icon={faQuestionCircle}/>,
        Expand: <FontAwesomeIcon icon={faExpand}/>,
        Minus: <FontAwesomeIcon icon={faMinus}/>
    }
});

interface TableTypes {
    all: any;
    saved: any;
    similar: any;
    similarPayload: any;
    keyword: any;
    author: any;
    source: any;
    year: any;
}

interface AppState {
    // Will change
    eventOrigin: string;
    spinner: boolean;
    globalFilterValue: TableTypes;
    columnsVisible: TableTypes;
    columnSortByValues: TableTypes;
    columnFilterValues: TableTypes;
    columns: TableTypes;
    dataFiltered: TableTypes;
    similarityType: IDropdownOption;
    maxSimilarPapers: IDropdownOption;
    embeddingType: IDropdownOption;
    paperNoEmbeddings: Object;
    isPanelOpen: boolean;
    dataKeywords: Array<any>;
    dataAuthors: Array<any>;
    dataSources: Array<any>;
    dataYears: Array<any>;
    dataTitles: Array<any>;
    dataAll: Array<any>;
    pointsAll: Array<any>;
    metaData: {};
    dataSimilarPayload: Array<any>;
    dataSimilar: Array<any>;
    dataSaved: Array<any>;
    dataSavedID: Array<any>;
    dataFilteredID: Array<any>;
    dataSimilarPayloadID: Array<any>;
    dataSimilarID: Array<any>;
    similarityPanelSelectedKey: String;
    selectNodeIDs: Array<any>;
    searchTitle: string;
    searchAbstract: string;
    searchByAbstractLimit: IDropdownOption;
    checkoutLinkRef: any;
    scrollToPaperID: number;
    isCiteUsCalloutVisible: boolean;
    // Will not change
    columnWidths: {};
    columnFilterTypes: {};
    chatText: string;
    chatResponse: string;
    chatResponsing: boolean;
    chatDoc: Array<any>;
    summarizeResponse: string;
    chatHistory: Array<any>;
    tabs: TabType[];
    activeKey: string;
    dialogStates: { [key: string]: any };
    chatSelectedPaper: string;
    offset: number;
    hasMoreData: boolean;

}

interface TabType {
    id: string;
    title: string;
}

interface ChatComponentProps {
    chatId: string;
}

const embeddingTypeDropdownOptions = [
    {key: 'specter', text: 'Specter'},
    {key: 'glove', text: 'Glove'},
    {key: 'ada', text: 'Ada'}
];

const similarityTypeDropdownOptions = [
    {key: 'nD', text: 'nD'},
    {key: '2D', text: '2D'}
];

const maxSimilarPapersDropdownOptions = [
    {key: '25', text: '25'},
    {key: '50', text: '50'},
    {key: '100', text: '100'},
    {key: '250', text: '250'},
    {key: '-1', text: 'All'},
];

class App extends React.Component<{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            spinner: true,
            isCiteUsCalloutVisible: false,
            columnFilterTypes: {
                "ID": "default",
                "Title": "default",
                "Authors": "multiselect-tokens",
                "Source": "multiselect",
                "Year": "range",
                "Abstract": "default",
                "Keywords": "multiselect-tokens",
                "Sim": "range",
                "Distance": "range",
                "Sim_Rank": "range",
                "CitationCounts": "range",
                "Keyword": "multiselect",
                "KeywordCount": "range",
                "Author": "multiselect",
                "AuthorCount": "range",
                "SourceCount": "range",
                "YearCount": "range"
            },
            columnWidths: {
                "ID": {maxWidth: 50},
                "Title": {minWidth: 100},
                "Authors": {minWidth: 100},
                "Source": {maxWidth: 200},
                "Year": {maxWidth: 200},
                "Abstract": {minWidth: 100},
                "Keywords": {minWidth: 100},
                "Sim": {maxWidth: 50},
                "Distance": {maxWidth: 50},
                "Sim_Rank": {maxWidth: 50},
                "CitationCounts": {maxWidth: 50},
                "Keyword": {minWidth: 100},
                "KeywordCount": {maxWidth: 125},
                "Author": {minWidth: 100},
                "AuthorCount": {maxWidth: 125},
                "SourceCount": {maxWidth: 125},
                "YearCount": {maxWidth: 125},
            },
            columns: {
                all: ["ID", "Title", "Authors", "Source", "Year", "Abstract", "Keywords", "CitationCounts"],
                saved: ["ID", "Title", "Authors", "Source", "Year", "Abstract", "Keywords", "CitationCounts"],
                similar: ["ID", "Title", "Authors", "Source", "Year", "Abstract", "Keywords", "CitationCounts", "Sim", "Distance", "Sim_Rank"],
                similarPayload: ["ID", "Title", "Authors", "Source", "Year", "Abstract", "Keywords", "CitationCounts"],
                keyword: ["Keyword", "KeywordCount"],
                author: ["Author", "AuthorCount"],
                source: ["Source", "SourceCount"],
                year: ["Year", "YearCount"]
            },
            columnsVisible: {
                all: ["Title", "Authors", "Source", "Year"],
                saved: ["Title", "Authors", "Source", "Year"],
                similar: ["Title", "Sim"],
                similarPayload: ["Title"],
                keyword: ["Keyword", "KeywordCount"],
                author: ["Author", "AuthorCount"],
                source: ["Source", "SourceCount"],
                year: ["Year", "YearCount"]
            },
            columnSortByValues: {
                all: [{id: 'Year', desc: true}],
                saved: [{id: 'Year', desc: true}],
                similar: [{id: 'Sim_Rank', asc: true}],
                similarPayload: [{id: 'Year', desc: true}],
                keyword: [{id: 'KeywordCount', desc: true}],
                author: [{id: 'AuthorCount', desc: true}],
                source: [{id: 'SourceCount', desc: true}],
                year: [{id: 'YearCount', desc: true}]
            },
            dataFiltered: {
                all: [],
                saved: [],
                similar: [],
                similarPayload: [],
                keyword: [],
                author: [],
                source: [],
                year: []
            },
            columnFilterValues: {
                all: [],
                saved: [],
                similar: [],
                similarPayload: [],
                keyword: [],
                author: [],
                source: [],
                year: []
            },
            globalFilterValue: {
                all: [],
                saved: [],
                similar: [],
                similarPayload: [],
                keyword: [],
                author: [],
                source: [],
                year: []
            },
            dataKeywords: [],
            dataAuthors: [],
            dataSources: [],
            dataYears: [],
            dataTitles: [],
            dataAll: [],
            pointsAll: [],
            metaData: {},
            dataSimilarPayload: [],
            dataSimilarPayloadID: [],
            dataSimilar: [],
            dataSimilarID: [],
            dataSaved: [],
            dataSavedID: [],
            dataFilteredID: [],
            similarityType: similarityTypeDropdownOptions[0],
            maxSimilarPapers: maxSimilarPapersDropdownOptions[0],
            embeddingType: embeddingTypeDropdownOptions[0],
            isPanelOpen: false,
            similarityPanelSelectedKey: String(0),
            selectNodeIDs: [],
            eventOrigin: "table",
            searchAbstract: "",
            searchTitle: "",
            searchByAbstractLimit: maxSimilarPapersDropdownOptions[0],
            checkoutLinkRef: React.createRef(),
            scrollToPaperID: 0,
            paperNoEmbeddings: {},
            chatText: '',
            chatResponse: '',
            chatResponsing: false,
            chatDoc: [],
            summarizeResponse: '',
            chatHistory: [],
            chatSelectedPaper: '',
            tabs: [{id: '1', title: 'Chat 1'}], // Initial state with one default tab
            activeKey: '1', // Track the active tab
            dialogStates: {
                '1': {chatText: '', chatHistory: [], chatResponse: '', chatSelectedPaper: ''}  // Initial state for the first dialog
            },
            offset: 0,
            hasMoreData: true
        }
    }
    loadMoreData = async () => {
        const { offset, hasMoreData } = this.state;
        const limit = 1000; // Specify limit of records to fetch

        if (hasMoreData) {
            const response = await fetch(`${baseUrl}getPapers?offset=${offset}&limit=${limit}`);
            const newData = await response.json();

            this.setState((prevState) => ({
                dataAll: [...prevState.dataAll, ...newData],
                offset: prevState.offset + limit,
                hasMoreData: newData.length === limit, // Check if more data is available
            }));
        }
    }

    addNewTab = () => {
        const newId = (this.state.tabs.length + 1).toString(); // Generate new ID
        this.setState((prevState) => ({
            tabs: [...prevState.tabs, { id: newId, title: `Chat ${newId}` }],
            activeKey: newId,
            dialogStates: {
                ...prevState.dialogStates,
                [newId]: { chatText: "", chatHistory: [], chatResponse: "", chatSelectedPaper: "" }
            }
        }));
    };
    removeTab = (id: string) => {
        const newTabs = this.state.tabs.filter((tab) => tab.id !== id);
        const newActiveKey = newTabs.length > 0 ? newTabs[0].id : "";
        const newDialogStates = { ...this.state.dialogStates };
        delete newDialogStates[id]; // Remove the dialog state for the closed tab

        this.setState({
            tabs: newTabs,
            activeKey: newActiveKey,
            dialogStates: newDialogStates
        });
    };

    setActiveKey = (key: string | null) => {
        if (key !== null) {
            this.setState({activeKey: key});
        }
    };
    updateDialogState = (tabId: string, updatedState: any) => {
        this.setState((prevState) => ({
            dialogStates: {
                ...prevState.dialogStates,
                [tabId]: {...prevState.dialogStates[tabId], ...updatedState}
            }
        }));
    };

    updateStateProp = (_what, _with, _where) => {
        var _property = {...this.state[_what]};
        _property[_where] = _with;
        let stateObj = {};
        stateObj[_what] = _property;
        this.setState(stateObj);
    }


    getData = () => {
        this.setState({spinner: true});
        let parent = this;

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        fetch(baseUrl + 'getPapers', requestOptions)
            .then(function (response) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.text();
            }).then(function (data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.
            const _dataAll = JSON.parse(data);
            const _paperNoEmbeddings = {
                "specter": [],
                "glove": [],
                "ada": []
            }
            _dataAll.forEach(_d => {
                if (!("specter_umap" in _d && Array.isArray(_d["specter_umap"]) && _d["specter_umap"].length == 2)) {
                    _paperNoEmbeddings["specter"].push(_d["ID"]);
                }
                if (!("glove_umap" in _d && Array.isArray(_d["glove_umap"]) && _d["glove_umap"].length == 2)) {
                    _paperNoEmbeddings["glove"].push(_d["ID"]);
                }
                if (!("ada_umap" in _d && Array.isArray(_d["ada_umap"]) && _d["ada_umap"].length == 2)) {
                    _paperNoEmbeddings["ada"].push(_d["ID"]);
                }
            });

            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["glove"], "glove");
            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["specter"], "specter");
            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["ada"], "ada");
            parent.setState({
                "dataAll": _dataAll,
                "spinner": false
            });
        });
    }

    getUmapPoints = () => {
        this.setState({spinner: true});
        let parent = this;

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        fetch(baseUrl + 'getUmapPoints', requestOptions)
            .then(function (response) {
                return response.text();
            }).then(function (data) {
            const _pointsAll = JSON.parse(data);
            const _paperNoEmbeddings = {
                "specter": [],
                "glove": [],
                "ada": []
            }
            _pointsAll.forEach(_d => {
                if (!("specter_umap" in _d && Array.isArray(_d["specter_umap"]) && _d["specter_umap"].length == 2)) {
                    _paperNoEmbeddings["specter"].push(_d["ID"]);
                }
                if (!("glove_umap" in _d && Array.isArray(_d["glove_umap"]) && _d["glove_umap"].length == 2)) {
                    _paperNoEmbeddings["glove"].push(_d["ID"]);
                }
                if (!("ada_umap" in _d && Array.isArray(_d["ada_umap"]) && _d["ada_umap"].length == 2)) {
                    _paperNoEmbeddings["ada"].push(_d["ID"]);
                }
            });

            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["glove"], "glove");
            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["specter"], "specter");
            parent.updateStateProp("paperNoEmbeddings", _paperNoEmbeddings["ada"], "ada");
            parent.setState({
                "pointsAll": _pointsAll,
                "spinner": false
            });
        });
    }

    getMetaData = () => {
        this.setState({spinner: true});
        let parent = this;

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        fetch(baseUrl + 'getMetaData', requestOptions)
            .then(function (response) {
                return response.text();
            }).then(function (data) {
            const _metaData = JSON.parse(data);
            parent.setState({
                "metaData": _metaData,
                "dataAuthors": _metaData.authors,  // Store authors metadata
                "dataSources": _metaData.sources,  // Store sources metadata
                "dataKeywords": _metaData.keywords,
                "dataTitles": _metaData.titles,
                "spinner": false
            });
        });
    }

    componentDidMount() {
        this.getData()
        this.getUmapPoints()
        this.getMetaData()
    }

    public render() {


        const toggleIsCiteUsCalloutVisible = () => {
            this.setState({
                isCiteUsCalloutVisible: !this.state.isCiteUsCalloutVisible
            });
        }

        const openGScholar = (title) => {
            // Inferring+Cognitive+Models+from+Data+using+Approximate+Bayesian+Computation
            const url = "https://scholar.google.com/scholar?hl=en&q=" + encodeURI(title);
            window.open(url, "_blank");
        }

        const hasEmbeddings = (ID) => {
            return this.state.paperNoEmbeddings[this.state.embeddingType.key as string].indexOf(ID) === -1;
        }

        const isInSimilarInputPapers = (row) => {
            if (Array.isArray(row)) {
                let _numSimilar = 0;
                row.forEach((r) => {
                    try {
                        if (this.state.dataSimilarPayloadID.includes(r["ID"])) {
                            _numSimilar += 1;
                        }
                    } catch (err) {
                        // continue
                    }
                });
                return _numSimilar == row.length;
            } else {
                try {
                    return this.state.dataSimilarPayloadID.includes(row["ID"]);
                } catch (err) {
                    return false;
                }
            }
        }

        const isInSimilarPapers = (row) => {
            if (Array.isArray(row)) {
                let _numSimilar = 0;
                row.forEach((r) => {
                    try {
                        if (this.state.dataSimilarID.includes(r["ID"])) {
                            _numSimilar += 1;
                        }
                    } catch (err) {
                        // continue
                    }
                });
                return _numSimilar == row.length;
            } else {
                try {
                    return this.state.dataSimilarID.includes(row["ID"]);
                } catch (err) {
                    return false;
                }
            }
        }

        const updateFilteredPaperIDs = (_filteredPapers) => {
            const _filteredPaperID = _filteredPapers.map((row) => {
                return row["ID"];
            });
            this.setState({
                dataFilteredID: _filteredPaperID
            })
        }

        const updateSimilarPaperIDs = (_similarPapers) => {
            const _similarPapersID = _similarPapers.map((row) => {
                return row["ID"];
            });
            this.setState({
                dataSimilarID: _similarPapersID
            })
        }

        const isInFilteredPapers = (row) => {
            if (Array.isArray(row)) {
                let _numFiltered = 0;
                row.forEach((r) => {
                    try {
                        if (this.state.dataFilteredID.includes(r["ID"])) {
                            _numFiltered += 1;
                        }
                    } catch (err) {
                        // continue
                    }
                });
                return _numFiltered == row.length;
            } else {
                try {
                    return this.state.dataFilteredID.includes(row["ID"]);
                } catch (err) {
                    return false;
                }
            }
        }

        const isInSelectedNodeIDs = (id) => {
            return this.state.selectNodeIDs.indexOf(id) !== -1;
        }

        const isInSavedPapers = (row) => {
            if (Array.isArray(row)) {
                let _numSaved = 0;
                row.forEach((r) => {
                    try {
                        if (this.state.dataSavedID.includes(r["ID"])) {
                            _numSaved += 1;
                        }
                    } catch (err) {
                        // continue
                    }
                });
                return _numSaved == row.length;
            } else {
                try {
                    return this.state.dataSavedID.includes(row["ID"]);
                } catch (err) {
                    return false;
                }
            }
        }

        const addToSimilarInputPapers = (row: any) => {
            const _papers = [...this.state.dataSimilarPayload]
            let _similarInputPapers = [...this.state.dataSimilarPayloadID];
            if (Array.isArray(row)) {
                row.forEach((r) => {
                    if (_papers.indexOf(r) === -1) {
                        _papers.push(r);
                        _similarInputPapers.push(r["ID"]);
                    }
                });
            } else {
                if (_papers.indexOf(row) === -1) {
                    _papers.push(row);
                    _similarInputPapers.push(row["ID"])
                }
            }
            this.setState({
                dataSimilarPayload: _papers,
                dataSimilarPayloadID: _similarInputPapers
            });
        }

        const addToSavedPapers = (row: any) => {
            let _papers = [...this.state.dataSaved];
            let _savedPaperIDs = [...this.state.dataSavedID];
            if (Array.isArray(row)) {
                row.forEach((r) => {
                    if (_papers.indexOf(r) === -1) {
                        _papers.push(r);
                    }
                    if (_savedPaperIDs.indexOf(r["ID"]) === -1) {
                        _savedPaperIDs.push(r["ID"]);
                    }
                });
            } else {
                if (_papers.indexOf(row) === -1) {
                    _papers.push(row);
                }
                if (_savedPaperIDs.indexOf(row["ID"]) === -1) {
                    _savedPaperIDs.push(row["ID"]);
                }
            }
            this.setState({
                dataSaved: _papers,
                dataSavedID: _savedPaperIDs
            });
        }

        const getSimilarPapersByAbstract = () => {
            this.setState({spinner: true});
            let parent = this;
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "embedding": this.state.embeddingType.key,
                    "input_data": {
                        "title": this.state.searchTitle,
                        "abstract": this.state.searchAbstract
                    },
                    "limit": this.state.searchByAbstractLimit.key == '-1' ? this.state.dataAll.length : this.state.searchByAbstractLimit.key
                })
            };
            fetch(baseUrl + "getSimilarPapersByAbstract", requestOptions)
                .then(response => response.json())
                .then((data) => {
                    updateSimilarPaperIDs(data);
                    parent.setState({
                        "dataSimilar": data,
                        "spinner": false,
                        "similarityPanelSelectedKey": String(2) // Redirect to the `Output Similar` tab.
                    });
                });
        }

        const getSimilarPapers = () => {
            this.setState({spinner: true});
            let parent = this;
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "input_data": this.state.dataSimilarPayload.map((item) => {
                        return item["ID"]
                    }),
                    "input_type": "ID",
                    "limit": this.state.maxSimilarPapers.key == '-1' ? this.state.dataAll.length : this.state.maxSimilarPapers.key,
                    "embedding": this.state.embeddingType.key,
                    "dimensions": this.state.similarityType.key
                })
            };
            fetch(baseUrl + "getSimilarPapers", requestOptions)
                .then(response => response.json())
                .then((data) => {
                    updateSimilarPaperIDs(data);
                    parent.setState({
                        "dataSimilar": data,
                        "spinner": false,
                        "similarityPanelSelectedKey": String(2) // Redirect to the `Output Similar` tab.
                    });
                });
        }

        const summarizePapers = (prompt) => {
            this.setState({summarizeResponse: 'SUMMARIZING ... ...'})
            fetch(`${baseUrl}summarize`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ids: this.state.dataSavedID, prompt: prompt})
            }).then(response => {
                const reader = response.body.getReader()
                const decoder = new TextDecoder('utf-8')
                let partial = ''
                this.setState({summarizeResponse: ''})

                const readChunk = ({done, value}) => {
                    if (done) {
                        if (partial) {
                            this.setState({summarizeResponse: `${partial}`})
                        }
                        return
                    }
                    partial += decoder.decode(value)
                    this.setState({summarizeResponse: `${partial}`})
                    reader.read().then(readChunk)
                }
                reader.read().then(readChunk)
            })
        }

        const literatureReviewPapers = (prompt) => {
            this.setState({summarizeResponse: 'LITERATURE REVIEW ... ...'})
            fetch(`${baseUrl}literatureReview`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ids: this.state.dataSavedID, prompt: prompt})
            }).then(response => {
                const reader = response.body.getReader()
                const decoder = new TextDecoder('utf-8')
                let partial = ''
                this.setState({summarizeResponse: ''})

                const readChunk = ({done, value}) => {
                    if (done) {
                        if (partial) {
                            this.setState({summarizeResponse: `${partial}`})
                        }
                        return
                    }
                    partial += decoder.decode(value)
                    this.setState({summarizeResponse: `${partial}`})
                    reader.read().then(readChunk)
                }
                reader.read().then(readChunk)
            })
        }

        const yearTableProps: SmartTableProps = {
            tableType: "year",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["year"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "year");
            },
            columnSortByValues: this.state.columnSortByValues["year"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "year");
            },
            columnFilterValues: this.state.columnFilterValues["year"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "year");
            },
            globalFilterValue: this.state.globalFilterValue["source"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "year");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "year")
            },
            dataFiltered: this.state.dataFiltered["year"],
            columnWidths: this.state.columnWidths,
            tableControls: [],
            columnIds: this.state.columns["year"],
        }

        const sourceTableProps: SmartTableProps = {
            tableType: "source",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["source"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "source");
            },
            columnSortByValues: this.state.columnSortByValues["source"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "source");
            },
            columnFilterValues: this.state.columnFilterValues["source"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "source");
            },
            globalFilterValue: this.state.globalFilterValue["source"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "source");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "source")
            },
            dataFiltered: this.state.dataFiltered["source"],
            columnWidths: this.state.columnWidths,
            tableControls: [],
            columnIds: this.state.columns["source"],
        }

        const authorTableProps: SmartTableProps = {
            tableType: "author",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["author"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "author");
            },
            columnSortByValues: this.state.columnSortByValues["author"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "author");
            },
            columnFilterValues: this.state.columnFilterValues["author"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "author");
            },
            globalFilterValue: this.state.globalFilterValue["author"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "author");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "author")
            },
            dataFiltered: this.state.dataFiltered["author"],
            columnWidths: this.state.columnWidths,
            tableControls: [],
            columnIds: this.state.columns["author"],
        }

        const keywordTableProps: SmartTableProps = {
            tableType: "keyword",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["keyword"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "keyword");
            },
            columnSortByValues: this.state.columnSortByValues["keyword"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "keyword");
            },
            columnFilterValues: this.state.columnFilterValues["keyword"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "keyword");
            },
            globalFilterValue: this.state.globalFilterValue["keyword"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "keyword");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "keyword")
            },
            dataFiltered: this.state.dataFiltered["keyword"],
            columnWidths: this.state.columnWidths,
            tableControls: [],
            columnIds: this.state.columns["keyword"]
        }

        const addToSelectNodeIDs = (IDs, _eventOrigin) => {
            if (IDs.length == 0) {
                this.setState({
                    eventOrigin: _eventOrigin,
                    selectNodeIDs: [],
                });
            } else {
                let _selectNodeIDs = [];
                _selectNodeIDs = [...this.state.selectNodeIDs];
                IDs.forEach((id) => {
                    let _idx = _selectNodeIDs.indexOf(id);
                    if (_idx === -1) {
                        _selectNodeIDs.push(id);
                    } else {
                        _selectNodeIDs.splice(_idx, 1);
                    }
                });

                this.setState({
                    eventOrigin: _eventOrigin,
                    selectNodeIDs: _selectNodeIDs
                });
            }
        }

        const checkoutPapers = () => {
            this.setState({spinner: true});
            let parent = this;

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "input_data": this.state.dataSavedID,
                    "input_type": "ID"
                })
            };
            fetch(baseUrl + 'checkoutPapers', requestOptions)
                .then(function (response) {
                    // The response is a Response instance.
                    // You parse the data into a useable format using `.json()`
                    return response.blob();
                }).then(function (blob) {

                const href = window.URL.createObjectURL(blob);
                const a = parent.state.checkoutLinkRef.current;
                a.download = 'checkedOutPapers.bibtex';
                a.href = href;
                a.click();
                a.href = '';

                parent.setState({
                    "spinner": false
                });
            });
        }

        const allPapersTableProps: SmartTableProps = {
            loadMoreData: this.loadMoreData,
            hasMoreData: this.state.hasMoreData,
            tableType: "all",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["all"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "all");
            },
            columnSortByValues: this.state.columnSortByValues["all"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "all");
            },
            columnFilterValues: this.state.columnFilterValues["all"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "all");
            },
            globalFilterValue: this.state.globalFilterValue["all"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "all");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                updateKeywordCounts(dataFiltered);
                updateAuthorCounts(dataFiltered);
                updateSourcesCounts(dataFiltered);
                updateYearsCounts(dataFiltered);
                updateFilteredPaperIDs(dataFiltered);
                this.updateStateProp("dataFiltered", dataFiltered, "all");
            },
            scrollToPaperID: this.state.scrollToPaperID,
            dataFiltered: this.state.dataFiltered["all"],
            columnWidths: this.state.columnWidths,
            tableControls: ["add", "save", "info", "locate"],
            columnIds: this.state.columns["all"],
            addToSavedPapers: addToSavedPapers,
            addToSimilarInputPapers: addToSimilarInputPapers,
            addToSelectNodeIDs: addToSelectNodeIDs,
            isInSimilarInputPapers: isInSimilarInputPapers,
            isInSavedPapers: isInSavedPapers,
            openGScholar: openGScholar,
            isInSelectedNodeIDs: isInSelectedNodeIDs,
        }

        const setScrollToPaperID = (_ID) => {
            this.setState({
                scrollToPaperID: _ID
            });
        }

        const deleteRows = (data, rowID) => {
            let _property = [...this.state[data]];
            if (Array.isArray(rowID)) {
                rowID.forEach((r) => {
                    _property.splice(r, 1);
                });
            } else {
                _property.splice(rowID, 1);
            }
            let obj = {};
            obj[data] = _property;
            this.setState(obj);
        }

        const savedPapersTableProps: SmartTableProps = {
            tableType: "saved",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["saved"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "saved");
            },
            columnSortByValues: this.state.columnSortByValues["saved"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "saved");
            },
            columnFilterValues: this.state.columnFilterValues["saved"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "saved");
            },
            globalFilterValue: this.state.globalFilterValue["saved"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "saved");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "saved")
            },
            dataFiltered: this.state.dataFiltered["saved"],
            columnWidths: this.state.columnWidths,
            tableControls: ["add", "delete", "info", "locate", "summarize", "literatureReview", "export"],
            columnIds: this.state.columns["saved"],
            deleteRow: (rowId) => {
                deleteRows("dataSaved", rowId);
                deleteRows("dataSavedID", rowId);
            },
            addToSimilarInputPapers: addToSimilarInputPapers,
            addToSelectNodeIDs: addToSelectNodeIDs,
            isInSimilarInputPapers: isInSimilarInputPapers,
            isInSavedPapers: isInSavedPapers,
            checkoutPapers: checkoutPapers,
            summarizePapers: summarizePapers,
            literatureReviewPapers: literatureReviewPapers,
            openGScholar: openGScholar,
            isInSelectedNodeIDs: isInSelectedNodeIDs,
        }

        const onChangeSearchTitle = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
            this.setState({searchTitle: newText})
        };

        const onChangeSearchAbstract = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
            this.setState({searchAbstract: newText})
        };

        const onChangeChatText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
            this.setState({chatText: newText})
        };

        const updateYearsCounts = (papers) => {
            let _countsObj = {};
            papers.forEach((paper) => {
                if (!(paper["Year"] in _countsObj)) {
                    _countsObj[paper["Year"]] = 0;
                }
                _countsObj[paper["Year"]]++;
            });
            let _countsArr = [];
            Object.keys(_countsObj).forEach(function (key) {
                _countsArr.push({"Year": key, "YearCount": _countsObj[key]})
            });
            this.setState({
                dataYears: _countsArr
            });
        }

        const updateSourcesCounts = (papers) => {
            let _countsObj = {};
            papers.forEach((paper) => {
                if (!(paper["Source"] in _countsObj)) {
                    _countsObj[paper["Source"]] = 0;
                }
                _countsObj[paper["Source"]]++;
            });
            let _countsArr = [];
            Object.keys(_countsObj).forEach(function (key) {
                _countsArr.push({"Source": key, "SourceCount": _countsObj[key]})
            });
            this.setState({
                dataSources: _countsArr
            });
        }

        const updateAuthorCounts = (papers) => {
            let _countsObj = {};
            papers.forEach((paper) => {
                if (Array.isArray(paper["Authors"])) {
                    paper["Authors"].forEach((author) => {
                        if (!(author in _countsObj)) {
                            _countsObj[author] = 0;
                        }
                        _countsObj[author]++;
                    });
                }
            });

            let _countsArr = [];
            Object.keys(_countsObj).forEach(function (key) {
                _countsArr.push({"Author": key, "AuthorCount": _countsObj[key]})
            });
            this.setState({
                dataAuthors: _countsArr
            });
        }

        const updateKeywordCounts = (papers) => {
            let _countsObj = {};
            papers.forEach((paper) => {
                if (Array.isArray(paper["Keywords"])) {
                    paper["Keywords"].forEach((keyword) => {
                        if (!(keyword in _countsObj)) {
                            _countsObj[keyword] = 0;
                        }
                        _countsObj[keyword]++;
                    });
                }
            });

            let _countsArr = [];
            Object.keys(_countsObj).forEach(function (key) {
                _countsArr.push({"Keyword": key, "KeywordCount": _countsObj[key]})
            });
            this.setState({
                dataKeywords: _countsArr
            });
        }

        const updateVisibleColumns = (columnId, tableType) => {
            var _property = {...this.state.columnsVisible};
            const idx = _property[tableType].indexOf(columnId);
            if (idx === -1) {
                _property[tableType].push(columnId);
            } else {
                _property[tableType].splice(idx, 1);
            }
            this.setState({columnsVisible: _property});
        }

        const similarPapersTableProps: SmartTableProps = {
            tableType: "similar",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["similar"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "similar");
            },
            columnSortByValues: this.state.columnSortByValues["similar"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "similar");
            },
            columnFilterValues: this.state.columnFilterValues["similar"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "similar");
            },
            globalFilterValue: this.state.globalFilterValue["similar"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "similar");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "similar")
            },
            dataFiltered: this.state.dataFiltered["similar"],
            columnWidths: this.state.columnWidths,
            tableControls: ["save", "add", "info", "locate"],
            columnIds: this.state.columns["similar"],
            addToSavedPapers: addToSavedPapers,
            addToSimilarInputPapers: addToSimilarInputPapers,
            addToSelectNodeIDs: addToSelectNodeIDs,
            isInSimilarInputPapers: isInSimilarInputPapers,
            isInSavedPapers: isInSavedPapers,
            openGScholar: openGScholar,
            isInSelectedNodeIDs: isInSelectedNodeIDs,
        }

        const similarPapersPayloadTableProps: SmartTableProps = {
            tableType: "similarPayload",
            embeddingType: this.state.embeddingType.key as string,
            hasEmbeddings: hasEmbeddings,
            tableData: {
                all: this.state.dataAll,
                saved: this.state.dataSaved,
                similar: this.state.dataSimilar,
                similarPayload: this.state.dataSimilarPayload,
                keyword: this.state.dataKeywords,
                author: this.state.dataAuthors,
                source: this.state.dataSources,
                year: this.state.dataYears,
                metaData: this.state.metaData
            },
            columnsVisible: this.state.columnsVisible["similarPayload"],
            updateVisibleColumns: (columnId) => {
                updateVisibleColumns(columnId, "similarPayload");
            },
            columnSortByValues: this.state.columnSortByValues["similarPayload"],
            updateColumnSortByValues: (sortBy) => {
                this.updateStateProp("columnSortByValues", sortBy, "similarPayload");
            },
            columnFilterValues: this.state.columnFilterValues["similarPayload"],
            updateColumnFilterValues: (filter) => {
                this.updateStateProp("columnFilterValues", filter, "similarPayload");
            },
            globalFilterValue: this.state.globalFilterValue["similarPayload"],
            updateGlobalFilterValue: (filter) => {
                this.updateStateProp("globalFilterValue", filter, "similarPayload");
            },
            columnFilterTypes: this.state.columnFilterTypes,
            setFilteredPapers: (dataFiltered) => {
                this.updateStateProp("dataFiltered", dataFiltered, "similarPayload")
            },
            dataFiltered: this.state.dataFiltered["similarPayload"],
            columnWidths: this.state.columnWidths,
            tableControls: ["save", "delete", "info", "locate"],
            columnIds: this.state.columns["similarPayload"],
            deleteRow: (rowId) => {
                deleteRows("dataSimilarPayload", rowId);
                deleteRows("dataSimilarPayloadID", rowId);
            },
            addToSavedPapers: addToSavedPapers,
            addToSimilarInputPapers: addToSimilarInputPapers,
            addToSelectNodeIDs: addToSelectNodeIDs,
            isInSimilarInputPapers: isInSimilarInputPapers,
            isInSavedPapers: isInSavedPapers,
            openGScholar: openGScholar,
            isInSelectedNodeIDs: isInSelectedNodeIDs,
        }

        const dialogProps = {
            'addToSelectNodeIDs': addToSelectNodeIDs,
            'addToSimilarInputPapers': addToSimilarInputPapers,
            'addToSavedPapers': addToSavedPapers,
        }

        const _items: ICommandBarItemProps[] = [
            {
                key: 'brand',
                commandBarButtonAs: () => (
                    <div style={{color: "white"}}>
                        {/* <Text variant="xLarge">vitaLITy</Text> */}
                        <img height="30" title="VitaLITy Logo" src={logo} alt="VitaLITy Logo"/>
                    </div>
                )
            },
            {
                key: 'description',
                commandBarButtonAs: () => (
                    <div style={{color: "white", marginLeft: 16, maxWidth: 280}}>
                        <Text variant="small">VitaLITy 2: Reviewing Academic Literature using Large Language
                            Models</Text>
                    </div>
                )
            },
            // {
            //   key: 'conferencebrand',
            //   commandBarButtonAs: () => (
            //     <div style={{ color: "white" }}>
            //       <img height="30" title="IEEE VIS Logo" src={visConferenceLogo} alt="IEEE VIS Logo" />
            //     </div>
            //   )
            // },
            // {
            //   key: 'citeus',
            //   commandBarButtonAs: () => (
            //     <div style={{ color: "white", marginLeft: 16, paddingLeft: 4, paddingRight: 4 }}>
            //       <DefaultButton id={"citationBtnId"} onClick={toggleIsCiteUsCalloutVisible} text={'Cite Us!'}></DefaultButton>
            //       {this.state.isCiteUsCalloutVisible && (
            //         <Callout
            //           style={{
            //             padding: '16px 16px',
            //             width: 450
            //           }}
            //           target={`#citationBtnId`}
            //           onDismiss={toggleIsCiteUsCalloutVisible}
            //           role="status"
            //           aria-live="assertive"
            //         >
            //           <DelayedRender>
            //             <div>
            //               <Text variant="medium">
            //                 A. Narechania, A. Karduni, R. Wesslen and E. Wall, <strong>"vitaLITy: Promoting Serendipitous Discovery of Academic Literature with Transformers &amp; Visual Analytics,"</strong> <i>in IEEE Transactions on Visualization and Computer Graphics</i>, vol. 28, no. 1, pp. 486-496, Jan. 2022, doi: 10.1109/TVCG.2021.3114820.
            //               </Text>
            //               <br /><br />
            //               <DefaultButton
            //                 style={{ marginLeft: 4, marginRight: 4 }}
            //                 onClick={() => {
            //                   const citation = `@ARTICLE{9552447,  author={Narechania, Arpit and Karduni, Alireza and Wesslen, Ryan and Wall, Emily},  journal={IEEE Transactions on Visualization and Computer Graphics},   title={VITALITY: Promoting Serendipitous Discovery of Academic Literature with Transformers  amp; Visual Analytics},   year={2022},  volume={28},  number={1},  pages={486-496},  doi={10.1109/TVCG.2021.3114820}}`
            //                   navigator.clipboard.writeText(citation);
            //                 }}
            //                 text={'Copy .BibTex'}>
            //               </DefaultButton>
            //               <DefaultButton
            //                 style={{ marginLeft: 4, marginRight: 4 }}
            //                 href="https://doi.org/10.1109/TVCG.2021.3114820"
            //                 target="_blank"
            //                 text="Other formats from IEEE TVCG'21"
            //                 title="Other formats from IEEE TVCG'21"></DefaultButton>
            //               <br />
            //             </div>
            //           </DelayedRender>
            //         </Callout>
            //       )}
            //     </div>
            //   )
            // },
            // {
            //   key: 'affiliationbrands',
            //   commandBarButtonAs: () => (
            //     <div style={{ color: "white", marginLeft: 16, paddingLeft: 4, paddingRight: 4 }}>
            //       <img height="30" src={gtLogo} title="Georgia Tech Logo" alt="Georgia Tech Logo" />
            //       &nbsp;&nbsp;
            //       <img height="30" src={northwesternLogo} title="Northwestern University Logo" alt="Northwestern University Logo" />
            //       &nbsp;&nbsp;
            //       <img height="30" src={unccLogo} title="University of North Carolina Charlotte Logo" alt="University of North Carolina Charlotte Logo" />
            //       &nbsp;&nbsp;
            //       <img height="30" src={emoryLogo} title="Emory University Logo" alt="Emory University Logo" />
            //     </div>
            //   )
            // }
        ];

        const _farItems: ICommandBarItemProps[] = [
            {
                key: 'embedding',
                commandBarButtonAs: () => (
                    <>
                        <Dropdown
                            label=""
                            selectedKey={this.state.embeddingType.key}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
                                this.setState({embeddingType: item})
                            }}
                            // disabled={true}
                            options={embeddingTypeDropdownOptions}
                            styles={{root: {zIndex: 2, paddingLeft: 4, paddingRight: 4}}}
                        />
                    </>
                )
            },
            {
                key: 'save',
                commandBarButtonAs: () => (<DefaultButton iconProps={{iconName: "ClipboardList"}} style={{
                    float: "right",
                    zIndex: 99,
                    paddingLeft: 4,
                    paddingRight: 4
                }} text={"Saved Papers (" + this.state.dataSaved.length + ")"}
                                                          onClick={() => this.setState({isPanelOpen: true})}/>)
            },
        ];

        const {tabs, activeKey, dialogStates} = this.state;


        function _inputButtonRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
            return (
                <div>
                    &nbsp;&nbsp;{defaultRenderer(link)}&nbsp;&nbsp;<Icon iconName="ArrowRight"
                                                                         style={{color: "#3498db"}}></Icon>&nbsp;&nbsp;
                </div>
            );
        }

        function _outputButtonRenderer(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
            return (
                <div>
                    &nbsp;&nbsp;<Icon iconName="Check"
                                      style={{color: "#27ae60"}}></Icon>&nbsp;&nbsp;{defaultRenderer(link)}&nbsp;&nbsp;
                </div>
            );
        }

        return (
            <>
                <LoadingOverlay
                    active={this.state.spinner}
                    spinner
                    text={'Loading'}
                    styles={{
                        wrapper: {},
                        overlay: (base) => ({...base, background: 'rgba(0, 0, 0, 0.5)'}),
                        content: (base) => ({...base, color: 'rgba(255, 255, 255, 1)'})
                    }}
                >
                    <CommandBar
                        items={_items}
                        farItems={_farItems}
                        styles={{
                            root: {
                                background: "rgba(0,0,0,0.9)",
                                padding: 8,
                                paddingBottom: 0,
                                borderBottom: "1px solid #ededed"
                            },
                        }}
                    />
                    <Panel
                        headerText="Saved Papers"
                        isOpen={this.state.isPanelOpen}
                        onDismiss={() => this.setState({isPanelOpen: false})}
                        type={PanelType.large}
                        closeButtonAriaLabel="Close"
                    >
                        <br/>
                        <a ref={this.state.checkoutLinkRef}></a>
                        <SmartTable props={savedPapersTableProps}></SmartTable>
                        <div style={{fontSize: '1.25em', lineHeight: '1.25em'}}>
                            <Markdown>{this.state.summarizeResponse}</Markdown></div>
                    </Panel>
                    <div className="m-t-md p-md">
                        <SmartTable props={allPapersTableProps}></SmartTable>
                    </div>
                    <Split
                        sizes={[33, 39, 28]}
                        direction="horizontal"
                        expandToMin={false}
                        gutterSize={0}
                        gutterAlign="center"
                        cursor="col-resize"
                    >
                        <div className="split p-md p-b-0">
                            <Stack horizontal horizontalAlign="space-between" verticalAlign="center"
                                   tokens={{childrenGap: 8}}>
                                <Label style={{fontSize: "1.2rem"}}>Similarity Search</Label>
                            </Stack>
                            <div className="similarityPanelPivot">
                                <Pivot linkSize={PivotLinkSize.normal} linkFormat={PivotLinkFormat.links}
                                       selectedKey={String(this.state.similarityPanelSelectedKey)}
                                       onLinkClick={(pivotItem: PivotItem) => this.setState({similarityPanelSelectedKey: pivotItem["key"].split(".")[1]})}>
                                    <PivotItem onRenderItemLink={_inputButtonRenderer} headerText={"By Papers"}
                                               itemCount={this.state.dataSimilarPayload.length}>
                                        <div className="m-t-lg"></div>
                                        <React.Fragment>
                                            <Stack horizontal verticalAlign="start" horizontalAlign="start"
                                                   tokens={{childrenGap: 8}}>
                                                <Label>Dimensions</Label>
                                                <Dropdown
                                                    label=""
                                                    selectedKey={this.state.similarityType.key}
                                                    // eslint-disable-next-line react/jsx-no-bind
                                                    onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
                                                        this.setState({similarityType: item})
                                                    }}
                                                    options={similarityTypeDropdownOptions}
                                                    styles={{root: {zIndex: 2}}}
                                                />
                                                <Label>Count</Label>
                                                <Dropdown
                                                    label=""
                                                    selectedKey={this.state.maxSimilarPapers.key}
                                                    // eslint-disable-next-line react/jsx-no-bind
                                                    onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
                                                        this.setState({maxSimilarPapers: item})
                                                    }}
                                                    options={maxSimilarPapersDropdownOptions}
                                                />
                                                {
                                                    this.state.dataSimilarPayload.length > 0 ?
                                                        <PrimaryButton text="Find Similar Papers"
                                                                       onClick={getSimilarPapers} allowDisabledFocus/> :
                                                        <PrimaryButton text="Find Similar Papers"
                                                                       onClick={getSimilarPapers} allowDisabledFocus
                                                                       disabled/>
                                                }
                                            </Stack>
                                        </React.Fragment>
                                        <div className="m-t-md"></div>
                                        <SmartTable props={similarPapersPayloadTableProps}></SmartTable>
                                    </PivotItem>
                                    <PivotItem onRenderItemLink={_inputButtonRenderer} headerText="By Abstract">
                                        <div className="m-t-lg"></div>
                                        <Stack horizontal tokens={{childrenGap: 8}}>
                                            <Label>Count</Label>
                                            <Dropdown
                                                label=""
                                                selectedKey={this.state.searchByAbstractLimit.key}
                                                // eslint-disable-next-line react/jsx-no-bind
                                                onChange={(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
                                                    this.setState({searchByAbstractLimit: item})
                                                }}
                                                options={maxSimilarPapersDropdownOptions}
                                            />
                                            <PrimaryButton style={{zIndex: 2}} text="Find Similar Papers"
                                                           onClick={getSimilarPapersByAbstract} allowDisabledFocus/>
                                        </Stack>
                                        <div className="m-t-md"></div>
                                        {/* Do not show title when switch to 'ada' embedding */}
                                        {this.state.embeddingType.key == 'ada' ||
                                            <TextField value={this.state.searchTitle || ''}
                                                       placeholder="Enter your own title here"
                                                       onChange={onChangeSearchTitle} defaultValue={""}/>}
                                        <div className="m-t-md"></div>
                                        <TextField value={this.state.searchAbstract || ''}
                                                   placeholder="Enter your own abstract here" multiline rows={15}
                                                   onChange={onChangeSearchAbstract} defaultValue={""}/>
                                        <div className="m-t-md"></div>
                                    </PivotItem>
                                    <PivotItem onRenderItemLink={_outputButtonRenderer} headerText={"Output Similar"}
                                               itemCount={this.state.dataSimilar.length}>
                                        <div className="m-t-lg"></div>
                                        <SmartTable props={similarPapersTableProps}></SmartTable>
                                    </PivotItem>
                                </Pivot>
                            </div>
                        </div>
                        <div className="split p-md p-b-0">
                            {this.state.dataFiltered["all"].length > 0 && this.state.dataAll.length > 0
                                ?
                                <PaperScatter props={
                                    {
                                        setScrollToPaperID: setScrollToPaperID,
                                        addToSavedPapers: addToSavedPapers,
                                        addToSimilarInputPapers: addToSimilarInputPapers,
                                        isInSavedPapers: isInSavedPapers,
                                        isInSimilarInputPapers: isInSimilarInputPapers,
                                        isInFilteredPapers: isInFilteredPapers,
                                        isInSimilarPapers: isInSimilarPapers,
                                        dataFiltered: this.state.dataFiltered["all"],
                                        dataSaved: this.state.dataSaved,
                                        dataSimilarPayload: this.state.dataSimilarPayload,
                                        dataSimilar: this.state.dataSimilar,
                                        // data: this.state.dataAll,
                                        data: this.state.pointsAll,
                                        selectNodeIDs: this.state.selectNodeIDs,
                                        addToSelectNodeIDs: addToSelectNodeIDs,
                                        embeddingType: this.state.embeddingType.key as string,
                                        openGScholar: openGScholar,
                                        eventOrigin: this.state.eventOrigin,
                                    }
                                }
                                ></PaperScatter>
                                : null
                            }
                        </div>
                        {/*<div className="split p-md p-b-0">*/}
                        {/*    <Stack horizontal horizontalAlign="space-between" verticalAlign="center"*/}
                        {/*           tokens={{childrenGap: 8}}>*/}
                        {/*        <Label style={{fontSize: "1.2rem"}}>Meta</Label>*/}
                        {/*    </Stack>*/}
                        {/*    <Pivot linkSize={PivotLinkSize.normal} linkFormat={PivotLinkFormat.links}>*/}
                        {/*        <PivotItem headerText={"Keywords"}>*/}
                        {/*            <div className="m-t-lg"></div>*/}
                        {/*            <SmartTable props={keywordTableProps}></SmartTable>*/}
                        {/*        </PivotItem>*/}
                        {/*        <PivotItem headerText={"Authors"}>*/}
                        {/*            <div className="m-t-lg"></div>*/}
                        {/*            <SmartTable props={authorTableProps}></SmartTable>*/}
                        {/*        </PivotItem>*/}
                        {/*        <PivotItem headerText={"Source"}>*/}
                        {/*            <div className="m-t-lg"></div>*/}
                        {/*            <SmartTable props={sourceTableProps}></SmartTable>*/}
                        {/*        </PivotItem>*/}
                        {/*        <PivotItem headerText={"Year"}>*/}
                        {/*            <div className="m-t-lg"></div>*/}
                        {/*            <SmartTable props={yearTableProps}></SmartTable>*/}
                        {/*        </PivotItem>*/}
                        {/*    </Pivot>*/}
                        {/*</div>*/}
                        <div className="split p-md p-b-0">
                            <div>
                                <label style={{fontSize: "1.2rem"}}>Chat Windows</label>
                            </div>
                            <Nav variant="tabs" activeKey={activeKey} onSelect={(k) => this.setActiveKey(k)}>
                                {tabs.map((tab) => (
                                    <Nav.Item key={tab.id} className="d-flex align-items-center">
                                        <Nav.Link eventKey={tab.id}>{tab.title}</Nav.Link>
                                        <Button
                                            variant="link"
                                            className="ml-1 p-0"
                                            onClick={() => this.removeTab(tab.id)}
                                            aria-label="Close tab"
                                        >
                                            <FontAwesomeIcon icon={faTimes} style={{ color: "grey", fontSize: "1rem", marginLeft: '8px' }} />
                                        </Button>
                                    </Nav.Item>
                                ))}
                                {/* Add button next to the last tab */}
                                <Nav.Item>
                                    <Button
                                        variant="link"
                                        className="add-button"
                                        onClick={this.addNewTab}
                                        aria-label="Add new tab"
                                    >
                                        {/* Transparent "+" sign inside a gray circle with SVG */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30px"
                                            height="30px"
                                            viewBox="0 0 24 24"
                                            className="add-icon"
                                        >
                                            <circle cx="12" cy="12" r="10" stroke="gray" strokeWidth="1.5" fill="none" />
                                            <line x1="8" y1="12" x2="16" y2="12" stroke="gray" strokeWidth="1.5" />
                                            <line x1="12" y1="8" x2="12" y2="16" stroke="gray" strokeWidth="1.5" />
                                        </svg>
                                    </Button>
                                </Nav.Item>
                            </Nav>
                            {/*<div className="tab-content mt-3">*/}
                                <div className="dialog-container">
                                    {tabs.map((tab) => (
                                        <Tab.Content key={tab.id}>
                                            {activeKey === tab.id && (
                                                <div className="dialog-content">
                                                    <Dialog
                                                        props={{
                                                            ...dialogStates[tab.id],
                                                            updateDialogState: (updatedState) =>
                                                                this.updateDialogState(tab.id, updatedState),
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Tab.Content>
                                    ))}
                                </div>
                            {/*</div>*/}
                        </div>
                    </Split>
                    {/*<Split*/}
                    {/*    sizes={[50, 50]}*/}
                    {/*    direction="horizontal"*/}
                    {/*    expandToMin={false}*/}
                    {/*    gutterSize={0}*/}
                    {/*    gutterAlign="center"*/}
                    {/*    cursor="col-resize"*/}
                    {/*>*/}
                    {/*<Dialog props={dialogProps}/>*/}
                    {/*<Dialog props={dialogProps}/>*/}
                    {/*</Split>*/}
                </LoadingOverlay>
            </>
        );
    }
}

export default hot(module)(App);