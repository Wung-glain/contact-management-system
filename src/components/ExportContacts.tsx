
import { Contact } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportContactsProps {
  contacts: Contact[];
}

export const ExportContacts = ({ contacts }: ExportContactsProps) => {
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Category'],
      ...contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone || '',
        contact.company || '',
        contact.category
      ])
    ];

    const csvString = csvContent.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      contacts.map(contact => ({
        Name: contact.name,
        Email: contact.email,
        Phone: contact.phone || '',
        Company: contact.company || '',
        Category: contact.category,
        'Created At': contact.createdAt.toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    XLSX.writeFile(workbook, 'contacts.xlsx');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border border-border shadow-lg">
        <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
