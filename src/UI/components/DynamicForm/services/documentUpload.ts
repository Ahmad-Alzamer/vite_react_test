import axios from "axios";

export async function documentUpload(document: File){
    let formData = new FormData();
    formData.append("document", document);
    const result = await axios.post('uploadDocument', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return result.data as {uploadStatus: string,documentId:string};

}