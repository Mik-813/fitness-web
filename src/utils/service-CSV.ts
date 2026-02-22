import { download, generateCsv, mkConfig } from 'export-to-csv'
import Papa from 'papaparse'

export function importCSV(onComplete: (results: unknown[]) => void) {
  const input = document.createElement('input') as HTMLInputElement
  input.type = 'file'
  input.accept = '.csv'
  input.style.display = 'none'
  input.addEventListener('change', (e: any) => {
    Papa.parse(
      e.target.files[0], 
      {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onComplete(results.data)
        },
      },
    )
  })
  input.click()
  input.remove()
}

export function exportCSV(filename: string, data: []) {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: filename,
  })
  const csv = generateCsv(csvConfig)(data)
  download(csvConfig)(csv)
}
