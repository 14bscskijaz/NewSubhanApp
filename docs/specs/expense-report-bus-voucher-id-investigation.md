# Expense Report Bus/Voucher ID Investigation

## Summary

The original issue had two separate causes:

1. The UI was falling back to `N/A` even when `busId` or `busClosingVoucherId` existed.
2. The API report endpoint was excluding `bus`-type expense rows when `amount = 0`, which removed the rows most likely to contain Bus/Voucher linkage.

Both of those code issues have now been fixed.

The current live API response shows that the remaining visible `N/A` values in the screenshot belong to `general` expense rows, and those records genuinely have `busId = null` and `busClosingVoucherId = null`.

## Evidence

### Live API response from `GET /api/Expense/Report?page=1&pageSize=20`

Observed locally on `http://localhost:7169`:

```json
{
  "totalItems": 3,
  "items": [
    {
      "busNumber": "",
      "id": 1,
      "date": "2026-03-19T13:58:37.895Z",
      "busId": null,
      "type": "general",
      "amount": 46,
      "description": "Suscipit necessitati",
      "busClosingVoucherId": null
    },
    {
      "busNumber": "",
      "id": 2,
      "date": "2026-03-19T13:58:37.895Z",
      "busId": null,
      "type": "general",
      "amount": 1,
      "description": "Nostrum quidem dolor",
      "busClosingVoucherId": null
    },
    {
      "busNumber": "salman34",
      "id": 3,
      "date": "2026-03-19T12:59:44.424Z",
      "busId": 1,
      "type": "bus",
      "amount": 0,
      "description": "",
      "busClosingVoucherId": 1
    }
  ],
  "columnTotals": {
    "amount": 47
  }
}
```

This proves:

- The backend now returns a bus-linked expense row.
- The two rows visible in the screenshot are `general` expenses and do not have linked Bus/Voucher IDs in the database.
- `Bus #` and `Voucher ID` cannot be shown for those two rows because the source data is null.

## Root Cause Timeline

### Issue 1: Frontend display logic

The expense report table previously rendered:

- `Bus #` from `busNumber` only
- `Voucher ID` with a weak truthy check

That caused `N/A` even in cases where:

- `busId` existed but `busNumber` was empty
- `busClosingVoucherId` existed but the value handling was too narrow

### Issue 2: API filtering logic

In `ExpenseController.GetExpenseReport()`, the API used:

```csharp
query = query.Where(e => e.Amount > 0);
```

That removed `bus`-type rows with `Amount = 0`.

Those rows are important because they often carry:

- `BusId`
- `BusClosingVoucherId`

After the fix, the filter is:

```csharp
query = query.Where(e =>
    e.Type == ExpenseType.bus ||
    (e.Amount ?? 0) > 0
);
```

This keeps bus-linked rows visible in the report.

## Current Code Status

### Backend fix

File:

- `BusServiceAPI/BusServiceAPI/Controllers/ExpenseController.cs`

Status:

- Fixed

### Frontend table fix

File:

- `frontend/app/dashboard/expense-report/_components/expense-report-table/columns.tsx`

Status:

- Fixed

Behavior:

- `Bus #` shows `busNumber`
- if `busNumber` is empty but `busId` exists, it shows `#<busId>`
- `Voucher ID` shows `#<busClosingVoucherId>` when present

### PDF fix

File:

- `frontend/app/dashboard/expense-report/pdf/route.tsx`

Status:

- Fixed

Behavior:

- PDF now includes Voucher ID
- PDF now falls back to `#busId` if `busNumber` is empty
- PDF footer total uses `amount` correctly

## Why The Screenshot Still Shows `N/A`

The visible rows in the screenshot are:

- `type = general`
- `busId = null`
- `busClosingVoucherId = null`

So `N/A` is expected for those specific rows.

The bus-linked row is now present in the API response, but it may not be visible in the screenshot for one of these reasons:

1. The page is only showing the first two rows.
2. The page size or pagination is hiding the third row.
3. The screenshot was taken before the refreshed API response was loaded.

## Expected Correct Behavior

The report should now behave like this:

- General expenses:
  - `Bus # = N/A`
  - `Voucher ID = N/A`
- Bus expenses:
  - `Bus # = busNumber` or `#busId`
  - `Voucher ID = #busClosingVoucherId`

## Verification Steps

1. Restart backend:

```powershell
cd D:\Duosoft\NewSubhanApp\BusServiceAPI\BusServiceAPI
dotnet watch run
```

2. Refresh the Expense Report page.

3. Confirm the report now includes the `bus` row returned by the API:

- `id = 3`
- `type = bus`
- `busNumber = salman34`
- `busClosingVoucherId = 1`

4. If only the first two rows are visible, check pagination or page size on the report page.

## Product Clarification Needed

If the desired behavior is:

"Even general expenses should always show a Bus and Voucher ID"

then this is not a rendering bug anymore. That would require a data model/business-rule change, because the current general expense records are stored without any bus or voucher linkage.

In that case, the required change would be:

- make `general` expenses optionally or mandatorily reference a Bus
- optionally reference a Bus Closing Voucher
- update creation forms to capture those values
- backfill existing general expense rows if historical linkage is required

