<script>
    import { processCSVFile } from "../services/fileProcessor";

    let files;

    $: if(files){
        //console.log(files[0]);
        processCSVFile(files[0]);        
    }
</script>


<label for="fileUpload">Upload a file:</label>
<input accept=".csv" bind:files id="fileUpload" name="fileUpload" type="file" />

