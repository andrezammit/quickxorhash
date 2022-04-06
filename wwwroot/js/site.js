(function QuickXorHash() {

    let _selectFileText = "";

    window.onload = async () => {

        document.querySelector("#textToHash").onkeydown = async function (event) {
            if (event.key == "Enter") {
                const textToHashDiv = document.querySelector("#textToHash");
                const textToHash = textToHashDiv.value;

                return processText(textToHash);
            }
        };

        _selectFileText = document.querySelector("#selectFile").innerHTML;

        const selectFileArea = document.querySelector("#selectFileArea");

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {

            selectFileArea.addEventListener(eventName, preventDefaults, false);
        })

        selectFileArea.addEventListener("drop", processDroppedFile, false);

        document.querySelector("#fileToHash").addEventListener("change", processSelectedFile);
        document.querySelector("#hashResult").addEventListener("click", copyHashToClipboard);
    }

    document.onpaste = async function (event) {

        var items = (event.clipboardData || event.originalEvent.clipboardData).items;

        if (items.length == 0) {
            return;
        }

        return processClipboardItems(items[0]);
    }

    function preventDefaults(event) {

        event.preventDefault()
        event.stopPropagation()
    }

    async function processDroppedFile(event) {

        const droppedFile = event.dataTransfer.files[0];

        return processFile(droppedFile);
    }

    async function processSelectedFile(event) {

        const selectedFile = event.target.files[0];

        return processFile(selectedFile);
    }

    async function processFile(file) {

        document.querySelector("#textToHash").value = "";
        document.querySelector("#selectFile").innerHTML = file.name;
        document.querySelector("#copiedToClipboard").classList.add("hidden");

        return getHash(file);
    }

    async function processText(textToHash) {

        document.querySelector("#selectFile").innerHTML = _selectFileText;
        document.querySelector("#copiedToClipboard").classList.add("hidden");

        const dataBlob = await new Blob([textToHash]).text();
        dataBlob.text = textToHash;

        return getHash(dataBlob);
    }

    async function processClipboardItems(clipboardItem) {

        document.querySelector("#textToHash").value = "";

        clipboardItem.getAsString(async function (string) {

            document.querySelector("#textToHash").value = string;
            return processText(string)
        });

        const fileToHash = clipboardItem.getAsFile();

        if (fileToHash == null) {
            return;
        }

        return processFile(fileToHash);
    }

    async function copyHashToClipboard(event) {

        navigator.clipboard.writeText(event.target.innerHTML);

        document.querySelector("#copiedToClipboard").classList.remove("hidden");
    }

    async function getHash(dataBlob) {

        document.querySelector("#hashResult").innerHTML = "";

        const response = await fetch("/api/quickxorhash", {
            method: "POST",
            body: dataBlob
        });

        const responseBlob = await response.blob();
        const quickXorHash = await responseBlob.text();

        const resultDiv = document.querySelector("#hashResult");
        resultDiv.innerHTML = quickXorHash;
    }
})();