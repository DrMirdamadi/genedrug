import { useEffect, useState, useRef } from 'react';
import React from 'react';

const SearchableCombobox = ({ options, value, onChange, placeholder, className, id, activeCombobox, setActiveCombobox, isAllDrugs, drugData }) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const filteredOptions = options.filter(option => {
    if (!search) return true;
    return option.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => a.localeCompare(b));

  const highlightText = (text) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === search.toLowerCase() 
        ? <span key={i} className="bg-yellow-200">{part}</span>
        : part
    );
  };

  const handleFocus = () => {
    setActiveCombobox(id);
    setIsFocused(true);
    setSearch('');
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      setSearch('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
    setActiveCombobox(null);
  };

  const getInteractionColor = (drugName) => {
    if (!isAllDrugs || !drugData) return '';
    
    const drug = drugData.find(d => d.drug === drugName);
    if (!drug) return '';

    const interaction = drug.interaction.toLowerCase();
    if (interaction.includes('major')) return 'text-red-700 font-medium bg-red-50';
    if (interaction.includes('moderate')) return 'text-yellow-600 font-medium bg-yellow-50';
    if (interaction.includes('minimal')) return 'text-blue-700 font-medium bg-blue-50';
    return '';
  };

  const isOpen = activeCombobox === id;

  return (
    <div className="relative" onBlur={handleBlur}>
      <div className="relative">
        <input
          type="text"
          value={isFocused ? search : value || ''}
          onChange={(e) => {
            setSearch(e.target.value);
            if (value) onChange(''); // Clear selected value when typing
          }}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`w-full p-2 pr-8 border rounded-md ${className} ${value ? 'bg-blue-50' : ''}`}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
          {filteredOptions.map((option, index) => {
            const drugName = isAllDrugs ? option.split(' (')[0] : option;
            return (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  option === value 
                    ? 'bg-gray-100' 
                    : 'hover:bg-opacity-80'
                } ${getInteractionColor(drugName)}`}
                onClick={() => {
                  onChange(option);
                  setSearch('');
                  setActiveCombobox(null);
                  setIsFocused(false);
                }}
              >
                {highlightText(option)}
              </li>
            );
          })}
          {filteredOptions.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
};

const ModernMinimalTheme = ({ children }) => (
  <div className="space-y-8">
    <div className="bg-white">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: `${child.props.className || ''} bg-white shadow-sm border-gray-100`
          });
        }
        return child;
      })}
    </div>
  </div>
);

const MaterialDesignTheme = ({ children }) => (
  <div className="space-y-8 bg-gray-50 p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white shadow-md rounded-lg border-0 hover:shadow-lg transition-shadow duration-200`
        });
      }
      return child;
    })}
  </div>
);

const FlatUITheme = ({ children }) => (
  <div className="space-y-8 bg-gray-100 p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white border-0 rounded-md shadow-sm`
        });
      }
      return child;
    })}
  </div>
);

const GlassMorphismTheme = ({ children }) => (
  <div className="space-y-8 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white/70 backdrop-blur-md shadow-lg rounded-xl border border-white/20`
        });
      }
      return child;
    })}
  </div>
);

const CorporateTheme = ({ children }) => (
  <div className="space-y-8 bg-slate-50 p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white border border-slate-200 rounded-lg shadow-sm`
        });
      }
      return child;
    })}
  </div>
);

const MinimalDarkTheme = ({ children }) => (
  <div className="space-y-8 bg-gray-900 p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-gray-800 border border-gray-700 rounded-lg text-gray-100`
        });
      }
      return child;
    })}
  </div>
);

const SoftMedicalTheme = ({ children }) => (
  <div className="space-y-8 bg-gradient-to-br from-blue-50 via-white to-green-50 p-8 rounded-xl">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white/90 shadow-lg border-blue-100 rounded-xl`
        });
      }
      return child;
    })}
  </div>
);

const ContrastAccessibleTheme = ({ children }) => (
  <div className="space-y-8 bg-white p-8">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-yellow-50 border-2 border-gray-900 text-gray-900 font-medium`
        });
      }
      return child;
    })}
  </div>
);

const CompactDenseTheme = ({ children }) => (
  <div className="space-y-2 bg-gray-100 p-4">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          className: `${child.props.className || ''} bg-white shadow-none border p-4 rounded-sm`
        });
      }
      return child;
    })}
  </div>
);

const ThemeWrapper = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(1);

  const themes = {
    1: { component: ModernMinimalTheme, name: "Modern Minimal" },
    2: { component: MaterialDesignTheme, name: "Material Design" },
    3: { component: FlatUITheme, name: "Flat UI" },
    4: { component: GlassMorphismTheme, name: "Glass Morphism" },
    5: { component: CorporateTheme, name: "Corporate" },
    6: { component: MinimalDarkTheme, name: "Minimal Dark" },
    7: { component: SoftMedicalTheme, name: "Soft Medical" },
    8: { component: ContrastAccessibleTheme, name: "High Contrast Accessible" },
    9: { component: CompactDenseTheme, name: "Compact Dense" }
  };

  const ThemeComponent = themes[currentTheme].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-end">
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(Number(e.target.value))}
            className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>
        </div>
        <ThemeComponent>{children}</ThemeComponent>
      </div>
    </div>
  );
};

export default function DrugSelectorApp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugData, setDrugData] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [activeCombobox, setActiveCombobox] = useState(null);

  const comboboxRefs = useRef({});

  const handleComboboxFocus = (focusedId) => {
    // Clear and close all other comboboxes
    Object.entries(comboboxRefs.current).forEach(([id, ref]) => {
      if (id !== focusedId && ref.clearAndClose) {
        ref.clearAndClose();
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch('/defualtreport.json')
      .then(res => res.ok ? res.json() : Promise.reject('Not found'))
      .then(json => {
        loadJSON(json);
        setError(null);
      })
      .catch((err) => {
        console.log('Default report not found, please upload one.');
        setError('Please upload a report to begin.');
      })
      .finally(() => setLoading(false));
  }, []);

  const loadJSON = (json) => {
    try {
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
      setError(null);
    } catch (err) {
      setError('Error processing the report. Please check the file format.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        loadJSON(json);
      } catch (err) {
        setError("Invalid JSON file format");
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setError("Error reading file");
      setLoading(false);
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
        geneDescription: d.geneDescription || 'No gene description available.',
        urls: {
          drugBank: d.drugBankLabelURL || '',
          guideline: d.guideline || ''
        }
      }));
    }

    // Create a map to store unique drugs
    const drugMap = new Map();

    json.pgxGenes.forEach(gene => {
      (gene.Drug || []).forEach((drugName, i) => {
        const drugInfo = {
        drug: drugName,
        gene: gene.Gene,
        diplotype: gene.Diplotype || "",
        phenotype: Array.isArray(gene.Phenotype) ? gene.Phenotype[i] || gene.Phenotype[0] : gene.Phenotype,
        interaction: Array.isArray(gene.InteractionStrength) ? gene.InteractionStrength[i] || gene.InteractionStrength[0] : gene.InteractionStrength,
        recommendation: Array.isArray(gene.Recommendation) ? gene.Recommendation[i] || gene.Recommendation[0] : gene.Recommendation,
        category: Array.isArray(gene.DrugCategory) ? gene.DrugCategory[i] || gene.DrugCategory[0] : gene.DrugCategory,
        drugClass: Array.isArray(gene.DrugClass) ? gene.DrugClass[i] || gene.DrugClass[0] : gene.DrugClass,
          geneDescription: gene.ConsultationText && Array.isArray(gene.ConsultationText) && gene.ConsultationText.length > 0 
            ? gene.ConsultationText[0] 
            : `No description available for ${gene.Gene} gene.`,
        urls: {
          drugBank: (gene.DrugBankLabelURL && gene.DrugBankLabelURL[i]) || "",
          guideline: (gene.GuidelineURL && gene.GuidelineURL[i]) || ""
        }
        };

        // If this drug already exists, update it only if the new interaction is stronger
        if (drugMap.has(drugName)) {
          const existingDrug = drugMap.get(drugName);
          const existingInteraction = (existingDrug.interaction || '').toLowerCase();
          const newInteraction = (drugInfo.interaction || '').toLowerCase();
          
          if (
            (newInteraction.includes('major') && !existingInteraction.includes('major')) ||
            (newInteraction.includes('moderate') && existingInteraction.includes('minimal'))
          ) {
            drugMap.set(drugName, drugInfo);
          }
        } else {
          drugMap.set(drugName, drugInfo);
        }
      });
    });

    // Convert map back to array
    return Array.from(drugMap.values());
  };

  const handleDrugSelect = (drugName, category) => {
    // If selecting from "All Drugs", extract just the drug name
    const actualDrugName = drugName.includes('(') ? drugName.split(' (')[0] : drugName;
    const drugInfo = drugData.find(item => item.drug === actualDrugName);
    
    // If selecting a drug from a different category, clear the previous selection
    if (drugInfo && category !== 'all' && category !== getInteractionLevel(drugInfo.interaction)) {
      setSelectedDrug(null);
      return;
    }

    setSelectedDrug(drugInfo);
  };

  const getInteractionLevel = (interaction) => {
    const level = (interaction || '').toLowerCase();
    if (level.includes('major')) return 'major';
    if (level.includes('moderate')) return 'moderate';
    return 'minimal';
  };

  const getDrugDisplayValue = (drugInfo, category) => {
    if (!drugInfo) return '';
    
    if (category === 'all') {
      // For All Drugs box, show full drug info with interaction level first
      return `${drugInfo.drug} (${drugInfo.interaction || 'Unknown'}, ${drugInfo.category || 'Unknown'}, ${drugInfo.drugClass || 'Unknown'})`;
    }
    
    // For category boxes, only show the drug name if it matches the category
    const drugInteractionLevel = getInteractionLevel(drugInfo.interaction);
    if (category === drugInteractionLevel) {
      return drugInfo.drug;
    }
    return '';
  };

  const getInteractionStyle = (level) => {
    const interaction = (level || '').toLowerCase();
    if (interaction.includes("major")) return "border-red-700 bg-red-50 text-red-800";
    if (interaction.includes("moderate")) return "border-yellow-600 bg-yellow-50 text-yellow-800";
    return "border-blue-700 bg-blue-50 text-blue-800";
  };

  const getDivider = () => {
    const i = selectedDrug?.interaction?.toLowerCase();
    if (i?.includes("major")) return <hr className="my-2 border-red-300" />;
    if (i?.includes("moderate")) return <hr className="my-2 border-yellow-300" />;
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

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        const comboboxes = document.querySelectorAll('.relative');
        comboboxes.forEach(box => {
          if (box.contains(event.target)) return;
          // Find and trigger the close action for this combobox
          const input = box.querySelector('input');
          if (input) input.blur();
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <ThemeWrapper>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!patientInfo && !loading && (
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-base font-medium text-gray-900 mb-2">No Report Loaded</h3>
          <p className="text-gray-500 mb-3 text-sm">Upload a report to view drug interactions and recommendations.</p>
          <label className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors duration-200">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Report
            <input type="file" accept="application/json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {patientInfo && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3 gap-3">
            <img src="/WCH-logo.jpg" alt="WCH Logo" className="h-16 object-contain" />
            <div className="flex gap-4">
              <div className="text-sm">
                <div className="text-gray-500 text-xs">Patient Name</div>
                <div className="text-gray-900 font-bold">{patientInfo?.patientName || ""}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500 text-xs">Accession ID</div>
                <div className="text-gray-900 font-bold">{patientInfo?.sampleName || ""}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Patient Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="text-gray-900">{patientInfo?.patientName || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">DOB:</span>
                  <span className="text-gray-900">{patientInfo?.dob || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Sex:</span>
                  <span className="text-gray-900">{patientInfo?.sex || ""}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reference Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Physician:</span>
                  <span className="text-gray-900">{patientInfo?.orderingPhysician || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Sample ID:</span>
                  <span className="text-gray-900">{patientInfo?.sampleName || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Facility:</span>
                  <span className="text-gray-900">{patientInfo?.facility || ""}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Sample Information
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Specimen:</span>
                  <span className="text-gray-900">{patientInfo?.specimenSite || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Order Date:</span>
                  <span className="text-gray-900">{patientInfo?.dateOrdered || ""}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Report Date:</span>
                  <span className="text-gray-900">{patientInfo?.reportDate || ""}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 space-y-3">
            <div className="flex gap-3 items-center">
              <button 
                onClick={() => setSelectedDrug(null)} 
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
              <div className="relative flex-1">
                <input 
                  type="file" 
                  accept="application/json" 
                  onChange={handleFileUpload} 
                  className="w-full border border-gray-300 text-gray-700 rounded text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
                <label className="block font-medium text-red-700 mb-1 text-sm flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Major Interaction
                </label>
                <SearchableCombobox
                  id="major"
                  activeCombobox={activeCombobox}
                  setActiveCombobox={setActiveCombobox}
                  options={majorDrugs.map(d => d.drug)}
                  value={getDrugDisplayValue(selectedDrug, 'major')}
                  onChange={(value) => handleDrugSelect(value, 'major')}
                  placeholder="Search major..."
                  className="text-sm py-1"
                  drugData={drugData}
                  isAllDrugs={false}
                />
        </div>

        <div>
                <label className="block font-medium text-yellow-600 mb-1 text-sm flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Moderate Interaction
                </label>
                <SearchableCombobox
                  id="moderate"
                  activeCombobox={activeCombobox}
                  setActiveCombobox={setActiveCombobox}
                  options={moderateDrugs.map(d => d.drug)}
                  value={getDrugDisplayValue(selectedDrug, 'moderate')}
                  onChange={(value) => handleDrugSelect(value, 'moderate')}
                  placeholder="Search moderate..."
                  className="text-sm py-1"
                  drugData={drugData}
                  isAllDrugs={false}
                />
        </div>

        <div>
                <label className="block font-medium text-blue-700 mb-1 text-sm flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Minimal Interaction
                </label>
                <SearchableCombobox
                  id="minimal"
                  activeCombobox={activeCombobox}
                  setActiveCombobox={setActiveCombobox}
                  options={minimalDrugs.map(d => d.drug)}
                  value={getDrugDisplayValue(selectedDrug, 'minimal')}
                  onChange={(value) => handleDrugSelect(value, 'minimal')}
                  placeholder="Search minimal..."
                  className="text-sm py-1"
                  drugData={drugData}
                  isAllDrugs={false}
                />
        </div>
      </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1 text-sm flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                All Drugs
              </label>
              <SearchableCombobox
                id="all"
                activeCombobox={activeCombobox}
                setActiveCombobox={setActiveCombobox}
                options={drugData.map(d => `${d.drug} (${d.interaction}, ${d.category || 'Unknown'}, ${d.drugClass || 'Unknown'})`)}
                value={getDrugDisplayValue(selectedDrug, 'all')}
                onChange={(value) => handleDrugSelect(value, 'all')}
                placeholder="Search all drugs..."
                className="text-sm py-1"
                drugData={drugData}
                isAllDrugs={true}
              />
            </div>

      {selectedDrug && (
              <div className={`border p-3 rounded shadow-sm space-y-1.5 text-sm ${getInteractionStyle(selectedDrug.interaction)}`}>
                <h2 className="text-base font-semibold flex items-center gap-1">
            {getInteractionIcon(selectedDrug.interaction)} {selectedDrug.drug}
          </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <p><span className="font-medium">Gene:</span> {selectedDrug.gene}</p>
                  <p><span className="font-medium">Diplotype:</span> {selectedDrug.diplotype}</p>
                  <p><span className="font-medium">Phenotype:</span> {selectedDrug.phenotype}</p>
                  <p><span className="font-medium">Interaction:</span> {selectedDrug.interaction}</p>
                  <p className="col-span-2"><span className="font-medium">Recommendation:</span> {selectedDrug.recommendation}</p>
                  <p><span className="font-medium">Category:</span> {selectedDrug.category}</p>
                  <p><span className="font-medium">Class:</span> {selectedDrug.drugClass}</p>
                  <p className="col-span-2"><span className="font-medium">Gene Description:</span> {selectedDrug.geneDescription}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ThemeWrapper>
  );
}