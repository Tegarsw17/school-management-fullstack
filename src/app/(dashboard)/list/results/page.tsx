import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { getUserRole, RoleType } from '@/lib/authUtils';
import { resultsData, role } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { idText } from 'typescript';

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const getColumns = (role: RoleType) => [
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Student',
    accessor: 'student',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Score',
    accessor: 'score',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Class',
    accessor: 'class',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: 'hidden md:table-cell',
  },
  ...(role === 'admin' || role === 'teacher'
    ? [
        {
          header: 'Actions',
          accessor: 'action',
        },
      ]
    : []),
];

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const { role, currentUserId } = await getUserRole();
  const columns = getColumns(role);

  // url condition
  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value;
            break;
          case 'search':
            query.OR = [
              { Exam: { title: { contains: value, mode: 'insensitive' } } },
              { Student: { name: { contains: value, mode: 'insensitive' } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // role condition
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { Exam: { Lesson: { teacherId: currentUserId! } } },
        { Assignment: { Lesson: { teacherId: currentUserId! } } },
      ];
      break;

    case 'student':
      query.studentId = currentUserId!;
      break;

    case 'parent':
      query.Student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        Student: { select: { name: true, surname: true } },
        Exam: {
          include: {
            Lesson: {
              select: {
                Class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        Assignment: {
          include: {
            Lesson: {
              select: {
                Class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  const data = dataRes.map((item) => {
    const assestment = item.Exam || item.Assignment;
    if (!assestment) return;
    const isExam = 'startTime' in assestment;

    return {
      id: item.id,
      title: assestment.title,
      studentName: item.Student?.name,
      studentSurname: item.Student?.surname,
      teacherName: assestment.Lesson?.Teacher?.name,
      teacherSurname: assestment.Lesson?.Teacher?.surname,
      score: item.score,
      className: assestment.Lesson?.Class?.name,
      startTime: isExam ? assestment.startTime : assestment.startDate,
    };
  });

  console.log('Generated Query:', JSON.stringify(query, null, 2));

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-starPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.studentName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat('en-US').format(new Date(item.startTime))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === 'admin' || role === 'teacher') && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Result</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-starYellow">
              <Image src={'/filter.png'} alt="logo" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-starYellow">
              <Image src={'/sort.png'} alt="logo" width={14} height={14} />
            </button>
            {(role === 'admin' || role === 'teacher') && (
              <FormModal table="result" type="create" />
            )}
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

export default ResultListPage;
