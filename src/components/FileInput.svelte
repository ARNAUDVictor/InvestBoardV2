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


<label for="fileUpload">Upload a file:</label>
<input accept=".csv" bind:files id="fileUpload" name="fileUpload" multiple type="file" />

