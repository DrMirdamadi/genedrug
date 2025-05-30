import React, { useState } from 'react';
import { useDrugStore } from '@/store/drugStore';
import { Drug, DrugInteraction, InteractionSeverityEnum } from '@/types/drug';

const DrugInteractionChecker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    selectedDrugs,
    searchResults,
    interactions,
    isLoading,
    error,
    searchDrugs,
    selectDrug,
    removeDrug,
    checkInteractions,
    clearSelection
  } = useDrugStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    await searchDrugs(searchQuery);
  };

  const handleDrugSelect = (drug: Drug) => {
    selectDrug(drug);
  };

  const handleDrugRemove = (drugId: string) => {
    removeDrug(drugId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case InteractionSeverityEnum.MAJOR:
        return 'bg-red-100 text-red-800';
      case InteractionSeverityEnum.MODERATE:
        return 'bg-yellow-100 text-yellow-800';
      case InteractionSeverityEnum.MINOR:
        return 'bg-green-100 text-green-800';
      case InteractionSeverityEnum.CONTRAINDICATED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Drug Interaction Checker</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a drug..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Selected Drugs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selected Drugs</h2>
        <div className="flex gap-4 mb-4">
          {selectedDrugs.map((drug) => (
            <div
              key={drug.id}
              className="p-4 border rounded-lg flex items-center justify-between gap-4 flex-1"
            >
              <div>
                <h3 className="font-medium">{drug.name}</h3>
                <p className="text-sm text-gray-600">{drug.genericName}</p>
              </div>
              <button
                onClick={() => handleDrugRemove(drug.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          {selectedDrugs.length < 2 && (
            <div className="flex-1 p-4 border rounded-lg border-dashed text-center text-gray-500">
              {selectedDrugs.length === 0
                ? 'Select first drug'
                : 'Select second drug'}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => checkInteractions()}
            disabled={selectedDrugs.length !== 2 || isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Check Interactions
          </button>
          <button
            onClick={clearSelection}
            disabled={selectedDrugs.length === 0}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {searchResults.map((drug) => (
              <button
                key={drug.id}
                onClick={() => handleDrugSelect(drug)}
                disabled={selectedDrugs.length >= 2 || selectedDrugs.some(d => d.id === drug.id)}
                className="p-4 border rounded-lg text-left hover:bg-gray-50 disabled:opacity-50"
              >
                <h3 className="font-medium">{drug.name}</h3>
                <p className="text-sm text-gray-600">{drug.genericName}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactions Results */}
      {interactions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Interactions Found</h2>
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="p-6 border rounded-lg mb-4"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getSeverityColor(interaction.severity)}`}>
                {interaction.severity.toUpperCase()}
              </div>
              <h3 className="text-lg font-medium mb-2">Interaction Details</h3>
              <p className="mb-4">{interaction.description}</p>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <p className="text-gray-700">{interaction.recommendation}</p>
              {interaction.mechanismOfAction && (
                <>
                  <h4 className="font-medium mt-4 mb-2">Mechanism of Action</h4>
                  <p className="text-gray-700">{interaction.mechanismOfAction}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker; 