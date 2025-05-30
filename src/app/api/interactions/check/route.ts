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
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const drug1Id = searchParams.get('drug1Id');
  const drug2Id = searchParams.get('drug2Id');

  if (!drug1Id || !drug2Id) {
    return NextResponse.json(
      { error: 'Both drug1Id and drug2Id are required' },
      { status: 400 }
    );
  }

  const interaction = mockInteractions.find(
    int => (int.drug1Id === drug1Id && int.drug2Id === drug2Id) ||
           (int.drug1Id === drug2Id && int.drug2Id === drug1Id)
  );

  if (!interaction) {
    return NextResponse.json(null);
  }

  return NextResponse.json(interaction);
} 