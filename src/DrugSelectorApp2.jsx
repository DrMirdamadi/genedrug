import { useEffect, useState } from 'react';

export default function DrugSelectorApp() {
  useEffect(() => {
    fetch('/defualtreport.json')
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(json => loadJSON(json))
      .catch(() => console.log('Default report not found, please upload one.'));
  }, []);
  
  const [search, setSearch] = useState("");
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugData, setDrugData] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);

  const loadJSON = (json) => {
    const extracted = extractDrugs(json);
    setDrugData(extracted);
    setSelectedDrug(null);
    setSearch("");
    if (json.patientInfo) {
      setPatientInfo(json.patientInfo);
    } else if (json.sampleState) {
      const {
        sampleName, patientName, reportDate, sampleNote, drugs, dob,
        sex, orderingPhysician, facility, specimenSite, dateOrdered
      } = json.sampleState;
      setPatientInfo({ sampleName, patientName, reportDate, sampleNote, drugs, dob, sex, orderingPhysician, facility, specimenSite, dateOrdered });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        loadJSON(json);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const extractDrugs = (json) => {
    if (!json.pgxGenes && Array.isArray(json.drugRecommendations)) {
      return json.drugRecommendations.map((d, i) => ({
        drug: d.drug,
        gene: d.gene || '',
        diplotype: d.diplotype || '',
        phenotype: d.phenotype || '',
        interaction: d.interaction || '',
        recommendation: d.recommendation || '',
        category: d.category || '',
        drugClass: d.class || '',
        geneDescription: d.geneDescription || '',
        urls: {
          drugBank: d.drugBankLabelURL || '',
          guideline: d.guideline || ''
        }
      }));
    }
    return json.pgxGenes.flatMap(gene => {
      return (gene.Drug || []).map((drugName, i) => ({
        drug: drugName,
        gene: gene.Gene,
        diplotype: gene.Diplotype || "",
        phenotype: Array.isArray(gene.Phenotype) ? gene.Phenotype[i] || gene.Phenotype[0] : gene.Phenotype,
        interaction: Array.isArray(gene.InteractionStrength) ? gene.InteractionStrength[i] || gene.InteractionStrength[0] : gene.InteractionStrength,
        recommendation: Array.isArray(gene.Recommendation) ? gene.Recommendation[i] || gene.Recommendation[0] : gene.Recommendation,
        category: Array.isArray(gene.DrugCategory) ? gene.DrugCategory[i] || gene.DrugCategory[0] : gene.DrugCategory,
        drugClass: Array.isArray(gene.DrugClass) ? gene.DrugClass[i] || gene.DrugClass[0] : gene.DrugClass,
        geneDescription: gene.ConsultationText ? gene.ConsultationText[0] : "",
        urls: {
          drugBank: (gene.DrugBankLabelURL && gene.DrugBankLabelURL[i]) || "",
          guideline: (gene.GuidelineURL && gene.GuidelineURL[i]) || ""
        }
      }));
    });
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    const drugInfo = drugData.find(item => item.drug === value);
    setSelectedDrug(drugInfo);
  };

  const getInteractionIcon = (level) => {
    const interaction = (level || '').toLowerCase();
    if (interaction.includes("major")) return "⚠️";
    if (interaction.includes("moderate")) return "ℹ️";
    return "✅";
  };

  const majorDrugs = drugData.filter(d => d.interaction.toLowerCase().includes("major")).sort((a, b) => a.drug.localeCompare(b.drug));
  const moderateDrugs = drugData.filter(d => d.interaction.toLowerCase().includes("moderate")).sort((a, b) => a.drug.localeCompare(b.drug));
  const minimalDrugs = drugData.filter(d => d.interaction.toLowerCase().includes("minimal")).sort((a, b) => a.drug.localeCompare(b.drug));

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      {patientInfo && (
        <section>
          <h2>Patient Information</h2>
          <p><strong>Patient Name:</strong> {patientInfo.patientName}</p>
          <p><strong>DOB:</strong> {patientInfo.dob}</p>
          <p><strong>Sex:</strong> {patientInfo.sex}</p>
          <p><strong>Sample ID:</strong> {patientInfo.sampleName}</p>
          <p><strong>Physician:</strong> {patientInfo.orderingPhysician}</p>
          <p><strong>Facility:</strong> {patientInfo.facility}</p>
          <p><strong>Specimen:</strong> {patientInfo.specimenSite}</p>
          <p><strong>Date Ordered:</strong> {patientInfo.dateOrdered}</p>
          <p><strong>Report Date:</strong> {patientInfo.reportDate}</p>
        </section>
      )}

      <section>
        <label htmlFor="fileUpload">Upload New JSON File:</label>
        <input id="fileUpload" type="file" accept="application/json" onChange={handleFileUpload} />
      </section>

      <section>
        <label>Select a Drug (All):</label>
        <select onChange={handleSelect} value={selectedDrug?.drug || ""}>
          <option value="">Select</option>
          {drugData.slice().sort((a, b) => a.drug.localeCompare(b.drug)).map((item, index) => (
            <option key={index} value={item.drug}>
              {`${item.drug} (${item.category || 'Unknown'}, ${item.drugClass || 'Unknown'})`}
            </option>
          ))}
        </select>
      </section>

      {selectedDrug && (
        <section style={{ marginTop: '2rem' }}>
          <h2>{getInteractionIcon(selectedDrug.interaction)} {selectedDrug.drug}</h2>
          <p><strong>Gene:</strong> {selectedDrug.gene}</p>
          <p><strong>Diplotype:</strong> {selectedDrug.diplotype}</p>
          <p><strong>Phenotype:</strong> {selectedDrug.phenotype}</p>
          <p><strong>Interaction:</strong> {selectedDrug.interaction}</p>
          <p><strong>Recommendation:</strong> {selectedDrug.recommendation}</p>
          <p><strong>Category:</strong> {selectedDrug.category}</p>
          <p><strong>Class:</strong> {selectedDrug.drugClass}</p>
          <p><strong>Gene Description:</strong> {selectedDrug.geneDescription}</p>

          <p><strong>References:</strong></p>
          <ul>
            {selectedDrug.urls.drugBank && (
              <li><a href={selectedDrug.urls.drugBank} target="_blank" rel="noreferrer">DrugBank Label</a></li>
            )}
            {selectedDrug.urls.guideline && (
              <li><a href={selectedDrug.urls.guideline} target="_blank" rel="noreferrer">CPIC Guideline</a></li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
