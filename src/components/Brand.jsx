import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function Brand({ light = false }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/"><BookOpen size={25} strokeWidth={1.8}/><span>MuseNest</span></Link>
}