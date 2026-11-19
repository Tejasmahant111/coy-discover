import { redirect } from 'next/navigation';

// Open straight into the Discover tab; Home is a placeholder for Coy's existing experience.
export default function Index() {
  redirect('/discover');
}
