import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetBlocksQuery } from '@/graphql-mimir/generated/graphql';
import BlockTable, { type Block } from '@/components/BlockTable';

const ITEMS_PER_PAGE = 20;

export default function BlockListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blocks, setBlocks] = useState<Block[]>([]);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  const { data: blocksData, loading: blocksLoading } = useGetBlocksQuery({
    variables: {
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    },
    pollInterval: 8 * 1000,
  });

  useEffect(() => {
    if (blocksData?.blocks?.items) {
      const blockList: Block[] = blocksData.blocks.items.map((block) => ({
        index: block.object.index,
        hash: block.object.hash,
        timestamp: block.object.timestamp,
        transactionCount: block.object.txCount,
        miner: block.object.miner,
        stateRootHash: block.object.stateRootHash,
      }));
      setBlocks(blockList);
    }
  }, [blocksData]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', newPage.toString());
    }
    setSearchParams(newSearchParams);
  };

  const hasNextPage = blocksData?.blocks?.pageInfo?.hasNextPage || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Blocks</h1>

        <div className="bg-white border border-gray-200 rounded-lg">
          <BlockTable loading={blocksLoading} blocks={blocks} detail />

          {!blocksLoading && blocks.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Page {page}</div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="px-3 py-2 text-sm text-gray-600">Page {page}</span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
