function submitForm() {
  const formData = {
    text: document.querySelector('textarea[name="text"]').value,
    pattern: document.querySelector('#patternSelector').value
  };

  const csvContent = processForm(formData);

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(blob);

  // Format the current date and time
  const now = new Date();
  const filename = 'Output' +
    now.getFullYear() +
    ('0' + (now.getMonth() + 1)).slice(-2) +
    ('0' + now.getDate()).slice(-2) +
    ('0' + now.getHours()).slice(-2) +
    ('0' + now.getMinutes()).slice(-2) +
    '.csv';

  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function processForm(formData) {
  // Define the regex patterns to match each entry, case-insensitive
  const entryPattern1 = /NAME: "(.*?)", DESCR: "(.*?)"\s*PID: (.*?),\s*VID: (.*?),\s*SN: (.*?)\s*(?=\nNAME:|\n$|$)/gi;
  const entryPattern3 = /Name: (.*?)\s+Descr: (.*?)\s+PID: (.*?)\s+VID: (.*?)\s+SN: (.*?)\s*(?=\nName:|\n$|$)/gi;
  const entryPattern2 = /Name:\s*(.*?)\s*Descr:\s*(.*?)\s*PID:\s*(.*?)\s*VID:\s*(.*?)\s*SN:\s*(.*?)(?=\nName:|\n$|$)/i;

  let csvData = [];
  let matches;
  let entryPattern;

  // Determine which pattern to use based on user selection
  if (formData.pattern === 'ASR') {
    entryPattern = entryPattern1;
  } else if (formData.pattern === 'NCS') {
    entryPattern = entryPattern2;
  }

  // Use match method to find all matches for pattern 2
  if (formData.pattern === 'NCS') {
    let match;
    while ((match = entryPattern.exec(formData.text)) !== null) {
      const name = `"${match[1].trim()}"`;
      const descr = `"${match[2].trim()}"`;
      const pid = `"${match[3].trim()}"`;
      const vid = `"${match[4].trim()}"`;
      const sn = `"${match[5].trim()}"`;

      // Add the extracted values to the CSV data array
      csvData.push(`${name},${descr},${pid},${vid},${sn}`);
      
      // Reset lastIndex to 0 after each match
      entryPattern.lastIndex = 0;
    }
  } else {
    // For pattern 1, continue using exec method
    while ((match = entryPattern.exec(formData.text)) !== null) {
      csvData.push(formatCSVRow(match));
    }
  }

  // Generate CSV content
  return 'NAME,DESCR,PID,VID,SN\n' + csvData.join('\n');
}

// Helper function to format the CSV row for pattern 1
function formatCSVRow(match) {
  const name = `"${match[1].trim()}"`;
  const descr = `"${match[2].trim()}"`;
  const pid = `"${match[3].trim()}"`;
  const vid = `"${match[4].trim()}"`;
  const sn = `"${match[5].trim()}"`;
  return `${name},${descr},${pid},${vid},${sn}`;
}
