/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Check } from "lucide-react";
import { getCookie } from "@/utils/getCookieForClient";

interface AddButtonConfig {
  name: string;
  link: string;
}

type ViewDataProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton?: AddButtonConfig;
  actionComponent?: React.FC<{
    prop: TData;
    basePath: string;
  }>;
  basePath: string;
};

const ViewData = <TData, TValue>({
  columns,
  data,
  addButton,
  actionComponent: ActionComponent,
  basePath,
}: ViewDataProps<TData, TValue>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRowData, setSelectedRowData] = useState<TData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  });

  const handleRowClick = (
    row: TData,
    e: React.MouseEvent<HTMLTableRowElement>
  ) => {
    const target = e.target as HTMLElement;

    // Check if the clicked element is within the action column or delete dialog overlay
    const isActionColumn =
      target.closest("[data-column-id='actions']") !== null;
    const isDeleteDialogOverlay = target.closest("#deleteDialog") !== null;
    const isDeleteDialogCloseButton =
      target.closest("#deleteDialogCloseButton") !== null;
    const isDeleteDialogBody = target.closest("#deleteDialogBody") !== null;

    // If the click is not within the action column, delete dialog overlay, or close button, open the row dialog
    if (
      !isActionColumn &&
      !isDeleteDialogOverlay &&
      !isDeleteDialogCloseButton &&
      !isDeleteDialogBody
    ) {
      setSelectedRowData(row);
      setDialogOpen(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {(addButton && getCookie('id')) && (
          <Button className="bg-default">
            <Link href={addButton.link}>{addButton.name}</Link>
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table className="bg-whitefade rounded-md">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e:any) => handleRowClick(row.original, e)}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} data-column-id={cell.column.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-whitefade"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-whitefade"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Dialog for showing row details */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isDeleteDialogOpen) setDialogOpen(isOpen);
        }}
      >
        <DialogContent className="max-w-[40rem] w-full break-words h-[40rem] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Row Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-w-[36rem]">
            {selectedRowData && (
              <>
                {Object.entries(selectedRowData).map(([key, value]) => (
                  <div key={key} className="!break-words">
                    <strong>{key}:</strong>{" "}
                    {key === "image_url" ? (
                      <Image
                        src={String(value)}
                        alt="Image"
                        width={1000}
                        height={1000}
                        className="mt-2 rounded w-40 h-40"
                        priority
                      />
                    ) : key === "content_url" ? (
                      <Link href={String(value)} target="blank">
                        {String(value)}
                      </Link>
                    ) : key === "price" ? (
                      `${String(value)}$`
                    ) : key === "file_url" ? (
                      <Link href={String(value)} target="blank">
                        {String(value)}
                      </Link>
                    ) : key === "status" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          value == 1
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {value == 1 ? "Active" : "Disabled"}
                      </span>
                    ) : key === "allow_late_submissions" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          value === 1
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {value === 1 ? "Yes" : "No"}
                      </span>
                    ) : key === "courses" ? (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(value) &&
                          value.map((course: any) => (
                            <span
                              key={course.course_id}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                course.course_status == 1
                                  ? "text-green-700 bg-green-100"
                                  : "text-red-700 bg-red-100"
                              }`}
                            >
                              {course.course_name}
                            </span>
                          ))}
                      </div>
                    ) : key === "questions" ? (
                      <div className="space-y-2">
                        {Array.isArray(value) &&
                          value.map((question, index) => (
                            <div key={index} className="p-2 border rounded-md">
                              {question.is_question_image == 1 && (
                                <div>
                                  <Image
                                    src={question.question_image}
                                    alt="question image"
                                    width={1000}
                                    height={1000}
                                    className="w-20 h-20 object-contain"
                                  />
                                </div>
                              )}
                              <div>
                                <strong>Question {index + 1}:</strong>{" "}
                                {question.question_text}
                              </div>
                              <div>
                                <strong>Marks:</strong> {question.marks}
                              </div>
                              <div>
                                <strong>Type:</strong> {question.question_type}
                              </div>
                              {question.question_type === "mcq" && (
                                <div className="mt-2">
                                  <strong>Options:</strong>
                                  <ul className="ml-4 list-disc">
                                    {question.options?.map(
                                      (option: any, i: any) => (
                                        <li
                                          key={i}
                                          className="flex items-center space-x-2"
                                        >
                                          <span>{option.option_text}</span>
                                          {option.is_correct == 1 && (
                                            <Check className="text-green-500" />
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      String(value)
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <DialogFooter>
            {selectedRowData &&
              ActionComponent &&
              React.createElement(ActionComponent, {
                prop: selectedRowData,
                basePath: basePath,
              })}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewData;
