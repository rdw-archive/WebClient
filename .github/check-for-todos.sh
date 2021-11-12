set +e

echo "Checking for temporary comments..."

echo ""

NUMBER_OF_COMMITTED_TODOS=$(git diff HEAD origin/main | grep -o 'TODO' | wc -l)
NUMBER_OF_COMMITTED_TBDS=$(git diff HEAD origin/main | grep -o 'TBD' | wc -l)
NUMBER_OF_COMMITTED_WIPS=$(git diff HEAD origin/main | grep -o 'WIP' | wc -l)
NUMBER_OF_COMMITTED_FIXMES=$(git diff HEAD origin/main | grep -o 'FIXME' | wc -l)
NUMBER_OF_COMMITTED_HACKS=$(git diff HEAD origin/main | grep -o 'HACK' | wc -l)

echo "Committed TODOs: $NUMBER_OF_COMMITTED_TODOS"
echo "Committed TBDs: $NUMBER_OF_COMMITTED_TBDS"
echo "Committed WIPs: $NUMBER_OF_COMMITTED_WIPS"
echo "Committed FIXMEs: $NUMBER_OF_COMMITTED_FIXMES"
echo "Committed HACKs: $NUMBER_OF_COMMITTED_HACKS"

echo ""

if [ $NUMBER_OF_COMMITTED_TODOS -ne 0 ]; then
	echo "✗ Failed code check: TODOs are present and should be removed"
	echo ""
	echo "If the comments indicate an actual problem, feature, or improvement,"
	echo "they ought to be converted to a proper issue instead!"

	echo ""

	echo "Processed git diff:"
	echo ""
	git diff HEAD origin/main | grep --color=always 'TODO'

	exit 1
fi

if [ $NUMBER_OF_COMMITTED_TBDS -ne 0 ]; then
	echo "✗ Failed code check: TBDs are present and should be removed"
	echo ""
	echo "If the comments indicate an actual problem, feature, or improvement,"
	echo "they ought to be converted to a proper issue instead!"

	echo ""

	echo "Processed git diff:"
	echo ""
	git diff HEAD origin/main | grep --color=always 'TBD'

	exit 2
fi

if [ $NUMBER_OF_COMMITTED_WIPS -ne 0 ]; then
	echo "✗ Failed code check: WIPs are present and should be removed"
	echo ""
	echo "If the comments indicate an actual problem, feature, or improvement,"
	echo "they ought to be converted to a proper issue instead!"

	echo ""

	echo "Processed git diff:"
	echo ""
	git diff HEAD origin/main | grep --color=always 'WIP'

	exit 3
fi

if [ $NUMBER_OF_COMMITTED_FIXMES -ne 0 ]; then
	echo "✗ Failed code check: FIXMEs are present and should be removed"
	echo ""
	echo "If the comments indicate an actual problem, feature, or improvement,"
	echo "they ought to be converted to a proper issue instead!"

	echo ""

	echo "Processed git diff:"
	echo ""
	git diff HEAD origin/main | grep --color=always 'FIXME'

	exit 4
fi

if [ $NUMBER_OF_COMMITTED_HACKS -ne 0 ]; then
	echo "✗ Failed code check: HACKs are present and should be removed"
	echo ""
	echo "If the comments indicate an actual problem, feature, or improvement,"
	echo "they ought to be converted to a proper issue instead!"

	echo ""

	echo "Processed git diff:"
	echo ""
	git diff HEAD origin/main | grep --color=always 'HACK'

	exit 5
fi

echo "✓ No TODOs are present"

exit 0