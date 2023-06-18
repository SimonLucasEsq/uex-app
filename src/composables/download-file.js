export function useDownloadFile() {
  function downloadFile(blobData, contentDisposition) {
    const downloadUrl = window.URL.createObjectURL(new Blob([blobData]))
    const link = document.createElement('a')
    const filename = contentDisposition.split(';')[1].trim().replaceAll('"', '').split('=')[1]
  
    link.href = downloadUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  
  return { downloadFile }
}
