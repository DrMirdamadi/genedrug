import { NextResponse } from 'next/server';
import { Drug } from '@/types/drug';

// Mock data for demonstration
const mockDrugs: Drug[] = [
  {
    id: '1',
    name: 'Aspirin',
    genericName: 'acetylsalicylic acid',
    brandNames: ['Bayer', 'Bufferin', 'Ecotrin'],
    description: 'Pain reliever and fever reducer',
    category: 'NSAID',
    dosageForm: ['tablet', 'capsule'],
    contraindications: ['bleeding disorders', 'stomach ulcers'],
    sideEffects: ['stomach upset', 'bleeding']
  },
  {
    id: '2',
    name: 'Warfarin',
    genericName: 'warfarin sodium',
    brandNames: ['Coumadin', 'Jantoven'],
    description: 'Blood thinner',
    category: 'Anticoagulant',
    dosageForm: ['tablet'],
    contraindications: ['active bleeding', 'severe liver disease'],
    sideEffects: ['bleeding', 'bruising']
  },
  {
    id: '3',
    name: 'Lisinopril',
    genericName: 'lisinopril',
    brandNames: ['Prinivil', 'Zestril'],
    description: 'ACE inhibitor for blood pressure',
    category: 'ACE Inhibitor',
    dosageForm: ['tablet'],
    contraindications: ['pregnancy', 'angioedema history'],
    sideEffects: ['dry cough', 'dizziness']
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredDrugs = mockDrugs;
  
  if (query) {
    filteredDrugs = mockDrugs.filter(drug => 
      drug.name.toLowerCase().includes(query) ||
      drug.genericName.toLowerCase().includes(query) ||
      drug.brandNames.some((brand: string) => brand.toLowerCase().includes(query))
    );
  }

  const start = (page - 1) * pageSize;
  const paginatedDrugs = filteredDrugs.slice(start, start + pageSize);

  return NextResponse.json({
    drugs: paginatedDrugs,
    totalCount: filteredDrugs.length,
    page,
    pageSize
  });
}

export async function POST(request: Request) {
  const { searchQuery } = await request.json();
  
  if (!searchQuery) {
    return NextResponse.json(mockDrugs);
  }

  const filteredDrugs = mockDrugs.filter(drug => 
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return NextResponse.json(filteredDrugs);
} 