<script>
    import { processCSVFiles } from "../services/fileProcessor";

    let files;

    $: if(files){
        if(files.length != 2){
            console.error("Il faut uploader 2 fichiers")
        }
        else{
            processCSVFiles(files);
        }       
    }
</script>

<div class="file-upload">
    <label>
        <span>Ajoutez vos transactions</span>
        <span class="btn">Select files</span>
        <input accept=".csv" bind:files id="fileUpload" name="fileUpload" multiple type="file">
    </label>
</div>

<style>
 .file-upload {
            position: relative;
            display: inline-block;
            width: 300px;
            height: 40px;
        }

        .file-upload input[type="file"] {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        .file-upload label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            padding: 0 10px;
            border: 2px solid #DD7373;
            border-radius: 5px;
            background-color: transparent;
            color: #DD7373;
            font-weight: bold;
        }

        .file-upload .btn {
            background-color: #DD7373;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
        }
</style>
