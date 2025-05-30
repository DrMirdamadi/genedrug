import React from 'react';
import { Interaction } from '@/types/drug';
import { getSeverityColor } from '@/lib/utils';

interface InteractionDisplayProps {
  interaction: Interaction;
}

export function InteractionDisplay({ interaction }: InteractionDisplayProps) {
  const severityColorClass = getSeverityColor(interaction.severity);

  return (
    <div className="rounded-lg border p-4 mb-4">
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColorClass} mb-2`}>
        {interaction.severity.toUpperCase()}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Interaction Details</h3>
      
      <div className="space-y-2">
        <p className="text-gray-700">{interaction.description}</p>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-900">Recommendation</h4>
          <p className="text-gray-600">{interaction.recommendation}</p>
        </div>
      </div>
    </div>
  );
} 