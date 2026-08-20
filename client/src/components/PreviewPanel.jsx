import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
    useSandpack,
} from "@codesandbox/sandpack-react";

import { detectDependencies } from "../utils/sandpackUtils";
import { useAppContext } from "../context/AppContext";
import SandpackErrorMonitor from "./SandpackErrorMonitor";


// ---------------------------------------------------------
// Watches for file edits inside Sandpack
// ---------------------------------------------------------

function SandpackFileWatcher({ onLiveFileChange }) {
    const { sandpack } = useSandpack();
    const { files } = sandpack;

    const {
        activeProject,
        updateProjectFile,
    } = useAppContext();

    const activeProjectRef = useRef(activeProject);

    useEffect(() => {
        activeProjectRef.current = activeProject;
    }, [activeProject]);


    useEffect(() => {
        const project = activeProjectRef.current;

        if (!project) return;

        const updateFiles = {};
        let hasChanges = false;

        for (const [path, fileObj] of Object.entries(files)) {
            const fileCode = fileObj.code;

            updateFiles[path] = fileCode;

            const originalContent =
                typeof project.files[path] === "string"
                    ? project.files[path]
                    : project.files[path]?.content;

            if (
                originalContent !== undefined &&
                originalContent !== fileCode
            ) {
                hasChanges = true;
            }
        }

        if (!hasChanges) return;

        // Update local live state
        onLiveFileChange?.(updateFiles);

        // Save changes to backend
        updateProjectFile(updateFiles);

    }, [
        files,
        onLiveFileChange,
        updateProjectFile,
    ]);

    return null;
}


// ---------------------------------------------------------
// Preview Panel
// ---------------------------------------------------------

const PreviewPanel = ({
    project,
    activeFile,
    showCode,
}) => {

    const [showErrorOverlay, setShowErrorOverlay] = useState(true);

    // Local files used for live editor changes
    const [liveFiles, setLiveFile] = useState(project.files);

    const projectKey = `${project._id}-${project.version}`;

    const previousProjectKey = useRef(projectKey);


    // ---------------------------------------------------------
    // Reset local files ONLY when project/version changes
    // ---------------------------------------------------------

    useEffect(() => {
        if (previousProjectKey.current === projectKey) {
            return;
        }

        previousProjectKey.current = projectKey;

        setLiveFile(project.files);

    }, [
        projectKey,
        project.files,
    ]);


    // ---------------------------------------------------------
    // Stable callback
    // ---------------------------------------------------------

    const handleLiveFilesChange = useCallback((newFiles) => {

        setLiveFile((prev) => {

            let changed = false;

            for (const [path, code] of Object.entries(newFiles)) {

                if (prev[path] !== code) {
                    changed = true;
                    break;
                }

            }

            if (!changed) {
                return prev;
            }

            return newFiles;

        });

    }, []);


    // ---------------------------------------------------------
    // Convert project files to Sandpack format
    //
    // IMPORTANT:
    // Do NOT use activeFile here.
    // Do NOT use liveFiles here.
    //
    // This prevents Sandpack from resetting its active tab
    // whenever the user types.
    // ---------------------------------------------------------

    const sandpackFiles = useMemo(() => {

        const spFile = {};

        for (const [path, content] of Object.entries(project.files)) {

            const fileCode =
                typeof content === "string"
                    ? content
                    : content?.content || "";

            spFile[path] = {
                code: fileCode,
            };

        }

        return spFile;

    }, [projectKey]);


    // ---------------------------------------------------------
    // Normalize live files
    // ---------------------------------------------------------

    const normalizedLiveFiles = useMemo(() => {

        const files = {};

        for (const [path, content] of Object.entries(liveFiles)) {

            files[path] =
                typeof content === "string"
                    ? content
                    : content?.content || "";

        }

        return files;

    }, [liveFiles]);


    // ---------------------------------------------------------
    // Detect dependencies
    // ---------------------------------------------------------

    const dependencies = useMemo(() => {

        return detectDependencies(normalizedLiveFiles);

    }, [normalizedLiveFiles]);


    // ---------------------------------------------------------
    // Stable Sandpack setup
    //
    // Dependencies are calculated from project files for
    // Sandpack initialization.
    //
    // They are NOT recreated on every keystroke.
    // ---------------------------------------------------------

    const initialDependencies = useMemo(() => {

        const files = {};

        for (const [path, content] of Object.entries(project.files)) {

            files[path] =
                typeof content === "string"
                    ? content
                    : content?.content || "";

        }

        return detectDependencies(files);

    }, [projectKey]);


    const customSetup = useMemo(() => {

        return {
            dependencies: initialDependencies,
        };

    }, [initialDependencies]);


    // ---------------------------------------------------------
    // Render
    // ---------------------------------------------------------

    return (
        <div className="h-full w-full">

            <SandpackProvider
                key={projectKey}
                template="react"
                files={sandpackFiles}
                customSetup={customSetup}

                options={{
                    externalResources: [
                        "https://cdn.tailwindcss.com",
                        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
                    ],

                    classes: {
                        "sp-wrapper": "sp-wrapper",
                        "sp-layout": "sp-layout",
                        "sp-preview": "sp-preview",
                    },

                    logLevel: 0,
                }}

                theme={{
                    colors: {
                        surface1: "#ffffff",
                        surface2: "#f4f4f5",
                        surface3: "#e4e4e7",
                        clickable: "#71717a",
                        base: "#09090b",
                        disabled: "#a1a1aa",
                        hover: "#18181b",
                        accent: "#18181b",
                        error: "#ef4444",
                        errorSurface: "#fef2f2",
                    },

                    font: {
                        body: "'Urbanist', system-ui,-apple-system, sans-serif",
                        mono: "'Geist Mono', ui-monospace, monospace",
                        size: "13px",
                        lineHeight: "1.6",
                    },
                }}
            >

                {/* Watches typing and saves files */}
                <SandpackFileWatcher
                    onLiveFileChange={handleLiveFilesChange}
                />


                {/* Error monitor */}
                <SandpackErrorMonitor
                    onErrorChange={setShowErrorOverlay}
                />


                <SandpackLayout
                    style={{
                        height: "100%",
                        border: "none",
                        borderRadius: 0,
                        background: "transparent",
                    }}
                >

                    {showCode && (
                        <SandpackCodeEditor
                            showTabs
                            showLineNumbers
                            showInlineErrors
                            wrapContent
                            style={{
                                height: "100%",
                                flex: 1,
                                minWidth: 0,
                            }}
                        />
                    )}


                    <SandpackPreview
                        showNavigator={false}
                        showRefreshButton
                        showOpenInCodeSandbox={false}
                        showSandpackErrorOverlay={showErrorOverlay}
                        style={{
                            height: "100%",
                            flex: showCode ? 1 : 2,
                            minWidth: 0,
                        }}
                    />

                </SandpackLayout>

            </SandpackProvider>

        </div>
    );
};


export default PreviewPanel;