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

  const getInteractionStyle = (level) => {
    const interaction = (level || '').toLowerCase();
    if (interaction.includes("major")) return "border-red-700 bg-pink-100 text-red-800";
    if (interaction.includes("moderate")) return "border-orange-700 bg-orange-100 text-orange-800";
    return "border-blue-700 bg-blue-100 text-blue-800";
  };

  const getDivider = () => {
    const i = selectedDrug?.interaction?.toLowerCase();
    if (i?.includes("major")) return <hr className="my-2 border-red-300" />;
    if (i?.includes("moderate")) return <hr className="my-2 border-orange-300" />;
    return <hr className="my-2 border-blue-300" />;
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {patientInfo && (
        <div className="flex justify-between items-start border-b pb-4 mb-6 gap-4">
          <img src="/WCH-logo.jpg" alt="WCH Logo" className="h-16" />
          <div className="text-sm text-right">
            <div className="font-semibold">Patient Name</div>
            <div className="font-bold">{patientInfo?.patientName || ""}</div>
          </div>
          <div className="text-sm text-right">
            <div className="font-semibold">Accession ID</div>
            <div className="font-bold">{patientInfo?.sampleName || ""}</div>
          </div>
        </div>
      )}

      {patientInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-6 rounded border">
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Patient Information</h3>
            <p><strong>Patient Name:</strong> {patientInfo?.patientName || ""}</p>
            <p><strong>DOB:</strong> {patientInfo?.dob || ""}</p>
            <p><strong>Sex:</strong> {patientInfo?.sex || ""}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Reference Information</h3>
            <p><strong>Ordering Physician:</strong> {patientInfo?.orderingPhysician || ""}</p>
            <p><strong>Sample ID:</strong> {patientInfo?.sampleName || ""}</p>
            <p><strong>Referring Facility:</strong> {patientInfo?.facility || ""}</p>
          </div>
          <div>
            <h3 className="text-gray-700 font-semibold mb-2">Sample Information</h3>
            <p><strong>Specimen:</strong> {patientInfo?.specimenSite || ""}</p>
            <p><strong>Order Date:</strong> {patientInfo?.dateOrdered || ""}</p>
            <p><strong>Report Date:</strong> {patientInfo?.reportDate || ""}</p>
          </div>
        </div>
      )}

      <button onClick={() => setSelectedDrug(null)} className="bg-gray-200 text-sm px-3 py-1 rounded shadow">Reset Selection</button>
      <input type="file" accept="application/json" onChange={handleFileUpload} className="w-full border p-2 rounded" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-red-700">⚠️ Major Interaction</label>
          <select onChange={handleSelect} value={selectedDrug?.drug || ""} className="w-full border border-red-300 text-red-800 bg-pink-50 p-2 rounded">
            <option value="">Select</option>
            {majorDrugs.map((d, i) => (
              <option key={i} value={d.drug}>{d.drug}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-orange-700">ℹ️ Moderate Interaction</label>
          <select onChange={handleSelect} value={selectedDrug?.drug || ""} className="w-full border border-orange-300 text-orange-800 bg-orange-50 p-2 rounded">
            <option value="">Select</option>
            {moderateDrugs.map((d, i) => (
              <option key={i} value={d.drug}>{d.drug}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-blue-700">✅ Minimal Interaction</label>
          <select onChange={handleSelect} value={selectedDrug?.drug || ""} className="w-full border border-blue-300 text-blue-800 bg-blue-50 p-2 rounded">
            <option value="">Select</option>
            {minimalDrugs.map((d, i) => (
              <option key={i} value={d.drug}>{d.drug}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="block font-semibold mt-4">📋 All Drugs</label>
      <select onChange={handleSelect} value={selectedDrug?.drug || ""} className="w-full border border-gray-300 text-sm bg-white p-2 rounded mb-4 font-mono">
        <option value="">Select</option>
        {drugData.slice().sort((a, b) => a.drug.localeCompare(b.drug)).map((item, index) => (
          <option key={index} value={item.drug}>
            {`${item.drug} (${item.category || 'Unknown'}, ${item.drugClass || 'Unknown'})`}
          </option>
        ))}
      </select>

      {selectedDrug && (
        <div className={`border p-4 rounded shadow-md space-y-2 ${getInteractionStyle(selectedDrug.interaction)}`}>
          <h2 className="text-xl font-semibold">
            {getInteractionIcon(selectedDrug.interaction)} {selectedDrug.drug}
          </h2>
          {getDivider()}
          <p><span className="font-semibold">Gene:</span> {selectedDrug.gene}</p>
          {getDivider()}
          <p><span className="font-semibold">Diplotype:</span> {selectedDrug.diplotype}</p>
          {getDivider()}
          <p><span className="font-semibold">Phenotype:</span> {selectedDrug.phenotype}</p>
          {getDivider()}
          <p><span className="font-semibold">Interaction Strength:</span> {selectedDrug.interaction}</p>
          {getDivider()}
          <p><span className="font-semibold">Recommendation:</span> {selectedDrug.recommendation}</p>
          {getDivider()}
          <p><span className="font-semibold">Category:</span> {selectedDrug.category}</p>
          {getDivider()}
          <p><span className="font-semibold">Class:</span> {selectedDrug.drugClass}</p>
          {getDivider()}
          <p><span className="font-semibold">Gene Description:</span> {selectedDrug.geneDescription}</p>
          {getDivider()}
          <div>
            <span className="font-semibold">References:</span>
            <ul className="list-disc list-inside">
              {selectedDrug.urls.drugBank && (
                <li><a href={selectedDrug.urls.drugBank} target="_blank" rel="noopener noreferrer" className="underline">DrugBank Label</a></li>
              )}
              {selectedDrug.urls.guideline && (
                <li><a href={selectedDrug.urls.guideline} target="_blank" rel="noopener noreferrer" className="underline">CPIC Guideline</a></li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
