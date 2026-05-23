from typing import List
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import Field

class MotorVehiclesActRetriever(BaseRetriever):
    """
    Custom LangChain retriever executing keyword matches and semantic simulation 
    on the Indian Motor Vehicles Act, 1988.
    """
    docs: List[Document] = Field(default_factory=list)

    def _get_relevant_documents(self, query: str, *, run_manager=None) -> List[Document]:
        query_lower = query.lower()
        matched_docs = []
        
        for doc in self.docs:
            keywords = doc.metadata.get("keywords", [])
            section = doc.metadata.get("section", "").lower()
            
            # Simple keyword search mimicking vector distance thresholds
            if (any(k in query_lower for k in keywords) or 
                section in query_lower or 
                any(word in doc.page_content.lower() for word in query_lower.split() if len(word) > 3)):
                matched_docs.append(doc)
                
        # Return first 2 mock documents as fallback if none matched
        return matched_docs if matched_docs else self.docs[:2]

class RAGService:
    """
    Service coordination class for the Retrieval-Augmented Generation pipeline.
    Uses open-source LangChain abstractions to load MV Act documents.
    """
    def __init__(self):
        # Seed MVA Act database
        self.mock_mva_documents = [
            Document(
                page_content="Section 183(1) - Whoever drives a motor vehicle in contravention of the speed limits referred to in section 112 shall be punishable: (i) for light motor vehicles with a fine which shall not be less than one thousand rupees but which may extend to two thousand rupees.",
                metadata={
                    "section": "Section 183(1)",
                    "title": "Driving at excessive speed",
                    "standard_fine": 1000,
                    "max_fine": 2000,
                    "imprisonment_option": False,
                    "keywords": ["speed", "speeding", "limit", "fast", "over-speeding", "km/h", "radar", "camera", "calibration"]
                }
            ),
            Document(
                page_content="Section 184 - Whoever drives a motor vehicle at a speed or in a manner which is dangerous to the public, having regard to all the circumstances of the case, shall be punishable for the first offence with imprisonment for a term which may extend to one year or with fine which shall not be less than one thousand rupees but which may extend to five thousand rupees.",
                metadata={
                    "section": "Section 184",
                    "title": "Driving dangerously",
                    "standard_fine": 1000,
                    "max_fine": 5000,
                    "imprisonment_option": True,
                    "keywords": ["dangerous", "rash", "negligent", "reckless", "weaving", "red light", "jumped"]
                }
            ),
            Document(
                page_content="Section 185 - Whoever, while driving, or attempting to drive, a motor vehicle, has in his blood, alcohol exceeding 30 mg. per 100 ml. of blood detected in a test by a breath analyser, shall be punishable for the first offence with imprisonment for a term which may extend to six months, or with fine which may extend to ten thousand rupees, or with both.",
                metadata={
                    "section": "Section 185",
                    "title": "Driving by a drunken person or by a person under the influence of drugs",
                    "standard_fine": 10000,
                    "max_fine": 10000,
                    "imprisonment_option": True,
                    "keywords": ["drunk", "drunken", "alcohol", "influence", "breathalyzer", "bac", "liquor", "sober", "drugs"]
                }
            ),
            Document(
                page_content="Section 194D - Whoever drives a motor cycle or causes or allows a motor cycle to be driven in contravention of the provisions of section 129 (protective headgear) shall be punishable with a fine of one thousand rupees and he shall be disqualified for holding a license for a period of three months.",
                metadata={
                    "section": "Section 194D",
                    "title": "Penalty for not wearing protective headgear",
                    "standard_fine": 1000,
                    "max_fine": 1000,
                    "imprisonment_option": False,
                    "keywords": ["helmet", "headgear", "motorcycle", "bike", "scooter", "two-wheeler", "chinstrap"]
                }
            ),
            Document(
                page_content="Section 122 - No person in charge of a motor vehicle shall cause or allow the vehicle or any trailer to remain at rest on any public place in such a position or in such a condition or in such circumstances as to cause or be likely to cause danger, obstruction or undue inconvenience to other users of the road.",
                metadata={
                    "section": "Section 122",
                    "title": "Leaving vehicle in dangerous position",
                    "standard_fine": 500,
                    "max_fine": 500,
                    "imprisonment_option": False,
                    "keywords": ["parking", "no-parking", "obstructing", "towed", "obstruction", "abandoned"]
                }
            )
        ]
        
        # Instantiate LangChain retriever with mock DB
        self.retriever = MotorVehiclesActRetriever(docs=self.mock_mva_documents)

    async def query_mva_knowledgebase(self, query: str) -> List[Document]:
        """
        Asynchronously invokes the LangChain retriever to fetch relevant sections of MVA.
        """
        # Execute retrievals asynchronously using standard loop executor simulations
        relevant_docs = self.retriever._get_relevant_documents(query)
        return relevant_docs

rag_service = RAGService()
