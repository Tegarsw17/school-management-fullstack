import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { assignmentsData, examsData, lessonsData, role } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type AssignmentList = Assignment & {
  Lesson: {
    Subject: Subject;
    Class: Class;
    Teacher: Teacher;
  };
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

const renderRow = (item: AssignmentList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-starPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.Lesson.Subject.name}</td>
    <td className="hidden md:table-cell">{item.Lesson.Class.name}</td>
    <td className="hidden md:table-cell">
      {item.Lesson.Teacher.name + ' ' + item.Lesson.Teacher.surname}
    </td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat('en-US').format(new Date(item.dueDate))}
    </td>
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
const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // url condition
  const query: Prisma.AssignmentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.Lesson = { classId: parseInt(value) };
            break;
          case 'teacherId':
            query.Lesson = { teacherId: value };
            break;
          case 'search':
            query.Lesson = {
              Subject: { name: { contains: value, mode: 'insensitive' } },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        Lesson: {
          select: {
            Subject: { select: { name: true } },
            Teacher: { select: { name: true, surname: true } },
            Class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: query }),
  ]);

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
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
