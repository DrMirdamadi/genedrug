import { NextResponse } from 'next/server';
import { DrugInteraction } from '@/types/drug';

const mockInteractions: DrugInteraction[] = [
  {
    id: '1',
    drug1Id: '1', // Aspirin
    drug2Id: '2', // Warfarin
    severity: 'major',
    description: 'Increased risk of bleeding when aspirin is combined with warfarin',
    recommendation: 'Avoid combination unless specifically directed by healthcare provider. Monitor closely for signs of bleeding.',
    mechanismOfAction: 'Both drugs affect blood clotting through different mechanisms, leading to additive anticoagulant effects.',
    onsetTime: 'Rapid',
    references: [
      'https://www.drugs.com/interactions-check.php?drug_list=243-0,2311-0',
      'https://pubmed.ncbi.nlm.nih.gov/example'
    ]
  },
  {
    id: '2',
    drug1Id: '1', // Aspirin
    drug2Id: '3', // Lisinopril
    severity: 'moderate',
    description: 'May reduce the blood pressure lowering effects of lisinopril',
    recommendation: 'Monitor blood pressure regularly when using these medications together.',
    mechanismOfAction: 'NSAIDs may decrease the antihypertensive effects of ACE inhibitors by inhibiting prostaglandin synthesis.',
    onsetTime: 'Several days',
    references: [
      'https://www.drugs.com/interactions-check.php?drug_list=243-0,1476-0'
    ]
  },
  {
    id: '3',
    drug1Id: '2', // Warfarin
    drug2Id: '5', // Omeprazole
    severity: 'minor',
    description: 'May slightly increase the effect of warfarin',
    recommendation: 'Monitor INR more frequently when starting or stopping omeprazole.',
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const drugId = params.id;
  
  const relevantInteractions = mockInteractions.filter(
    interaction => interaction.drug1Id === drugId || interaction.drug2Id === drugId
  );

  if (relevantInteractions.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(relevantInteractions);
} 