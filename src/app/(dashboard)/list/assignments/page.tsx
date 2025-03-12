import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { assignmentsData, examsData, lessonsData, role } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

const columns = [
  {
    header: 'Subject Name',
    accessor: 'name',
  },
  {
    header: 'Class',
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Due Date',
    accessor: 'dueDate',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const AssignmentListPage = () => {
  const renderRow = (item: Assignment) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-starPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject}</td>
      <td className="hidden md:table-cell">{item.class}</td>
      <td className="hidden md:table-cell">{item.teacher}</td>
      <td className="hidden md:table-cell">{item.dueDate}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignment
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-starYellow">
              <Image src={'/filter.png'} alt="logo" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-starYellow">
              <Image src={'/sort.png'} alt="logo" width={14} height={14} />
            </button>
            {role === 'admin' && <FormModal table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
      {/* pagination */}
      <Pagination />
    </div>
  );
};

export default AssignmentListPage;
