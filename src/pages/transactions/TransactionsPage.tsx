import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { PaginationData } from "@/types/PaginationData";
import { Transaction } from "@/types/Transaction";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    totalEntries: 0,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
  });

  const setLoading = useLoadingStore((state) => state.setLoading);

  const location = useLocation();

  const page = new URLSearchParams(location.search).get("page") || "1";

  const getNextPage = () => {
    return paginationData.currentPage < paginationData.totalPages
      ? paginationData.currentPage + 1
      : paginationData.totalPages;
  };

  const getPrevPage = () => {
    return paginationData.currentPage > 1 ? paginationData.currentPage - 1 : 1;
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    await AxiosClient()
      .delete(`/entries/${id}`)
      .catch((error) => {
        console.error(error);
      });

    await fetchTransactions();
  };

  const fetchTransactions = async () => {
    setLoading(true);
    await AxiosClient()
      .get(`/entries?page=${page}`)
      .then((response) => {
        setTransactions(response.data.data.entries);
        setPaginationData(response.data.data.pagination);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [setLoading]);

  return (
    <div className="py-6">
      <div className="container">
        <div className="flex justify-between items-start">
          <div className="text-3xl font-medium mb-4">Transactions</div>
          <Link to="/transactions/new">
            <Button>New</Button>
          </Link>
        </div>
        <div className="rounded-md border bg-white p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {(paginationData.currentPage - 1) *
                      paginationData.itemsPerPage +
                      index +
                      1}
                  </TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell
                    className={`${
                      transaction.type == "INCOME"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell
                    className={`${
                      transaction.type == "INCOME"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    Rs. {transaction.amount}/-
                  </TableCell>

                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.updatedAt).toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="mx-auto">
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link to={`/transactions/${transaction._id}`}>
                          <DropdownMenuItem className="gap-2">
                            <Pencil size={13} /> Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            deleteTransaction(transaction._id);
                          }}
                          className="gap-2"
                        >
                          <Trash2 size={13} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="font-medium">
                      You don't have any transactions yet. <br />
                      <Link to="/transactions/new" className="text-primary">
                        Add a transaction
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href={`/transactions?page=${getPrevPage()}`}
                />
              </PaginationItem>
              <PaginationItem className="font-medium text-sm">
                {paginationData.currentPage} of {paginationData.totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href={`/transactions?page=${getNextPage()}`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
